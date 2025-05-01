package com.railease.payment.service;

import com.railease.payment.dto.BookingDTO;
import com.railease.payment.dto.NotificationRequest;
import com.railease.payment.dto.PaymentRequest;
import com.railease.payment.dto.UserDTO;
import com.railease.payment.entity.Payment;
import com.railease.payment.entity.PaymentStatus;
import com.railease.payment.exception.BookingServiceException;
import com.railease.payment.exception.PaymentNotFoundException;
import com.railease.payment.exception.RazorpayApiException;
import com.railease.payment.exception.SignatureVerificationException;
import com.railease.payment.feign.BookingServiceClient;
import com.railease.payment.feign.NotificationFeignClient;
import com.railease.payment.feign.RazorpayClientFeign;
import com.railease.payment.feign.UserFeignClient;
import com.railease.payment.repo.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.SignatureException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Formatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final RazorpayClient razorpayClient;
    private final PaymentRepository paymentRepository;
    private final BookingServiceClient bookingServiceClient;
    private final RazorpayClientFeign razorpayClientFeign;
    private final UserFeignClient userClient;
    private final NotificationFeignClient notificationFeignClient;

    @Value("${razorpay.key}")
    private String razorpayKey;

    @Value("${razorpay.secret}")
    private String razorpaySecret;
    @Transactional
    public Map<String, Object> createOrder(PaymentRequest request) throws RazorpayException {
        log.info("Creating order for booking ID: {}", request.getBookingId());

        // Validate request
        if (request.getBookingId() == null) {
            log.error("Booking ID cannot be null");
            throw new IllegalArgumentException("Booking ID cannot be null");
        }
        if (request.getAmount() == null || request.getAmount() <= 0) {
            log.error("Amount must be greater than 0");
            throw new IllegalArgumentException("Amount must be greater than 0");
        }
        if (request.getCurrency() == null || request.getCurrency().isEmpty()) {
            log.error("Currency cannot be null or empty");
            throw new IllegalArgumentException("Currency cannot be null or empty");
        }

        // Create Razorpay order
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", request.getAmount() * 100);
        orderRequest.put("currency", request.getCurrency());
        orderRequest.put("receipt", "booking_" + request.getBookingId());

        JSONObject notes = new JSONObject();
        notes.put("bookingId", request.getBookingId());
        notes.put("email", request.getUserEmail());
        orderRequest.put("notes", notes);

        Order order;
        try {
            order = razorpayClient.orders.create(orderRequest);
        } catch (RazorpayException e) {
            log.error("Failed to create Razorpay order for booking ID: {}", request.getBookingId(), e);
            throw e;
        }

        // Save payment record
        Payment payment = new Payment();
        payment.setRazorpayOrderId(order.get("id"));
        payment.setAmount(request.getAmount());
        payment.setCurrency(request.getCurrency());
        payment.setBookingId(request.getBookingId());
        payment.setStatus(PaymentStatus.CREATED);
        payment.setCreatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Prepare response
        Map<String, Object> response = new HashMap<>();
        response.put("id", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));
        response.put("status", order.get("status"));
        log.info("Order created with ID: {}", (Object) order.get("id"));

        return response;
    }

    @Transactional
    public Map<String, Object> verifyPayment(String orderId, String paymentId, String signature) {
        log.info("Verifying payment for order ID: {}", orderId);

        try {
            // Check if payment is already verified
            Optional<Payment> paymentOpt = paymentRepository.findByRazorpayOrderId(orderId);
            if (paymentOpt.isPresent() && paymentOpt.get().getStatus() == PaymentStatus.SUCCESS) {
                log.info("Payment already verified for order ID: {}", orderId);
                return Map.of("success", true, "orderId", orderId, "paymentId", paymentId);
            }

            if (paymentOpt.isEmpty()) {
                log.error("Payment not found for order ID: {}", orderId);
                throw new PaymentNotFoundException("Payment not found for order ID: " + orderId);
            }

            Payment payment = paymentOpt.get();

            // Verify signature
            String payload = orderId + "|" + paymentId;
            String generatedSignature = calculateRFC2104HMAC(payload, razorpaySecret);
            boolean verified = generatedSignature.equals(signature);

            // Update payment
            payment.setRazorpayPaymentId(paymentId);
            payment.setSignature(signature);
            payment.setStatus(verified ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
            paymentRepository.save(payment);

            Map<String, Object> response = new HashMap<>();
            response.put("success", verified);
            response.put("orderId", orderId);
            response.put("paymentId", paymentId);

            if (verified) {
                // Fetch booking
                BookingDTO booking = bookingServiceClient.getBooking(payment.getBookingId());

                // Confirm booking
                bookingServiceClient.confirmBooking(payment.getBookingId());
                log.info("Booking {} confirmed successfully", payment.getBookingId());

                // Fetch user
                ResponseEntity<UserDTO> userResponse = userClient.getUserById(booking.getUserId());
                if (!userResponse.getStatusCode().is2xxSuccessful() || userResponse.getBody() == null) {
                    log.warn("User not found for ID: {}", booking.getUserId());
                    return response; // Don't fail the flow just because of missing user
                }

                UserDTO user = userResponse.getBody();

                // Send confirmation email (best-effort)
                try {
                    NotificationRequest notificationRequest = new NotificationRequest();
                    notificationRequest.setTo(user.getEmail());
                    notificationRequest.setType("BOOKING_CONFIRMATION");
                    notificationRequest.setData(Map.of(
                            "userName", user.getName(),
                            "trainName", booking.getTrainName(),
                            "source", booking.getSource(),
                            "destination", booking.getDestination(),
                            "travelDate", booking.getTravelDate(),
                            "departureTime", booking.getDepartureTime(),
                            "bookingId", payment.getBookingId().toString(),
                            "totalPrice", booking.getBookedPrice()
                    ));

                    notificationFeignClient.sendNotification(notificationRequest);
                    log.info("Booking confirmation sent to {}", user.getEmail());
                } catch (Exception e) {
                    log.error("Failed to send booking confirmation to {}: {}", user.getEmail(), e.getMessage());
                }

            } else {
                // Mark booking as failed
                try {
                    bookingServiceClient.failBooking(payment.getBookingId());
                    log.info("Booking {} marked as FAILED due to signature verification failure", payment.getBookingId());
                } catch (FeignException e) {
                    log.error("Failed to mark booking {} as FAILED: {}", payment.getBookingId(), e.getMessage());
                }
                throw new SignatureVerificationException("Payment signature verification failed for order ID: " + orderId);
            }

            log.info("Payment verification result for order ID {}: {}", orderId, verified);
            return response;

        } catch (SignatureException e) {
            log.error("Failed to verify payment signature for order ID: {}", orderId, e);
            throw new SignatureVerificationException("Failed to verify payment signature for order ID: " + orderId);
        }
    }


    public LocalDateTime getOrderCreationTime(String razorpayOrderId) {
        log.info("Fetching order creation time for order ID: {}", razorpayOrderId);

        try {
            ResponseEntity<Object> response = razorpayClientFeign.getOrder(razorpayOrderId);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> body = (Map<String, Object>) response.getBody();
                Integer createdAt = (Integer) body.get("created_at");
                if (createdAt == null) {
                    log.error("Created_at field missing in Razorpay response for order ID: {}", razorpayOrderId);
                    throw new RazorpayApiException("Created_at field missing in Razorpay response for order ID: " + razorpayOrderId, null);
                }
                LocalDateTime creationTime = LocalDateTime.ofInstant(Instant.ofEpochSecond(createdAt), ZoneId.systemDefault());
                log.info("Order creation time for order ID {}: {}", razorpayOrderId, creationTime);
                return creationTime;
            } else {
                log.error("Failed to fetch order details from Razorpay for order ID: {}", razorpayOrderId);
                throw new RazorpayApiException("Failed to fetch order details from Razorpay for order ID: " + razorpayOrderId, null);
            }
        } catch (Exception e) {
            log.error("Error fetching order details from Razorpay for order ID: {}", razorpayOrderId, e);
            throw new RazorpayApiException("Error fetching order details from Razorpay for order ID: " + razorpayOrderId, e);
        }
    }

    private String calculateRFC2104HMAC(String data, String key) throws SignatureException {
        try {
            SecretKeySpec signingKey = new SecretKeySpec(key.getBytes(), "HmacSHA256");
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(signingKey);
            return toHexString(mac.doFinal(data.getBytes()));
        } catch (Exception e) {
            log.error("Failed to generate HMAC for data: {}", data, e);
            throw new SignatureException("Failed to generate HMAC: " + e.getMessage());
        }
    }

    private static String toHexString(byte[] bytes) {
        Formatter formatter = new Formatter();
        for (byte b : bytes) {
            formatter.format("%02x", b);
        }
        String result = formatter.toString();
        formatter.close();
        return result;
    }
}