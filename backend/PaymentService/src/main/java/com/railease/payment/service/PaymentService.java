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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.SignatureException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Formatter;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

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

    public String createOrder(PaymentRequest request) throws RazorpayException {
        if (request.getBookingId() == null) {
            throw new IllegalArgumentException("Booking ID cannot be null");
        }
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }
        if (request.getCurrency() == null || request.getCurrency().isEmpty()) {
            throw new IllegalArgumentException("Currency cannot be null or empty");
        }

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", request.getAmount() * 100);
        orderRequest.put("currency", request.getCurrency());
        orderRequest.put("receipt", "booking_" + request.getBookingId());

        JSONObject notes = new JSONObject();
        notes.put("bookingId", request.getBookingId());
        notes.put("email", request.getUserEmail());
        orderRequest.put("notes", notes);

        Order order = razorpayClient.orders.create(orderRequest);

        Payment payment = new Payment();
        payment.setRazorpayOrderId(order.get("id"));
        payment.setAmount(request.getAmount());
        payment.setCurrency(request.getCurrency());
        payment.setBookingId(request.getBookingId());
        payment.setStatus(PaymentStatus.CREATED);
        payment.setCreatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        return order.toString();
    }

    public boolean verifyPayment(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;
            String generatedSignature = calculateRFC2104HMAC(payload, razorpaySecret);

            boolean verified = generatedSignature.equals(signature);
            Optional<Payment> paymentOpt = paymentRepository.findByRazorpayOrderId(orderId);

            if (paymentOpt.isEmpty()) {
                throw new PaymentNotFoundException("Payment not found for order ID: " + orderId);
            }

            Payment payment = paymentOpt.get();
            payment.setRazorpayPaymentId(paymentId);
            payment.setSignature(signature);
            payment.setStatus(verified ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
            paymentRepository.save(payment);

            if (verified) {
                try {
                    // Fetch booking details
                    BookingDTO booking;
                    try {
                        booking = bookingServiceClient.getBooking(payment.getBookingId());
                    } catch (FeignException e) {
                        throw new BookingServiceException("Failed to fetch booking for ID: " + payment.getBookingId(), e);
                    }
                    Long userId = booking.getUserId();
                    String trainName = booking.getTrainName();
                    String source = booking.getSource();
                    String destination = booking.getDestination();
                    String travelDate = booking.getTravelDate();
                    String departureTime = booking.getDepartureTime();
                    Double bookedPrice = booking.getBookedPrice();

                    // Fetch user details
                    ResponseEntity<UserDTO> userResponse;
                    try {
                        userResponse = userClient.getUserById(userId);
                    } catch (FeignException e) {
                        throw new BookingServiceException("Failed to fetch user with ID: " + userId, e);
                    }
                    if (userResponse.getStatusCode() != HttpStatus.OK || userResponse.getBody() == null) {
                        throw new BookingServiceException("User not found with ID: " + userId);
                    }
                    UserDTO user = userResponse.getBody();

                    // Send confirmation email
                    NotificationRequest notificationRequest = new NotificationRequest();
                    notificationRequest.setTo(user.getEmail());
                    notificationRequest.setType("BOOKING_CONFIRMATION");
                    notificationRequest.setData(Map.of(
                            "userName", user.getName(),
                            "trainName", trainName,
                            "source", source,
                            "destination", destination,
                            "travelDate", travelDate,
                            "departureTime", departureTime,
                            "bookingId", payment.getBookingId().toString(),
                            "totalPrice", bookedPrice
                    ));

                    try {
                        notificationFeignClient.sendNotification(notificationRequest);
                        System.out.println("Booking confirmation sent to " + user.getEmail());
                    } catch (Exception e) {
                        System.err.println("Failed to send booking confirmation: " + e.getMessage());
                    }

                    // Confirm the booking
                    try {
                        bookingServiceClient.confirmBooking(payment.getBookingId());
                    } catch (FeignException e) {
                        throw new BookingServiceException("Failed to confirm booking for ID: " + payment.getBookingId(), e);
                    }
                } catch (Exception e) {
                    throw new BookingServiceException("Failed to confirm booking for ID: " + payment.getBookingId(), e);
                }
            } else {
                throw new SignatureVerificationException("Payment signature verification failed for order ID: " + orderId);
            }

            return verified;

        } catch (SignatureException e) {
            throw new SignatureVerificationException("Failed to verify payment signature for order ID: " + orderId);
        }
    }

    public LocalDateTime getOrderCreationTime(String razorpayOrderId) {
        try {
            ResponseEntity<Object> response = razorpayClientFeign.getOrder(razorpayOrderId);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> body = (Map<String, Object>) response.getBody();
                Integer createdAt = (Integer) body.get("created_at");
                if (createdAt == null) {
                    throw new RazorpayApiException("Created_at field missing in Razorpay response for order ID: " + razorpayOrderId, null);
                }
                return LocalDateTime.ofInstant(Instant.ofEpochSecond(createdAt), ZoneId.systemDefault());
            } else {
                throw new RazorpayApiException("Failed to fetch order details from Razorpay for order ID: " + razorpayOrderId, null);
            }
        } catch (Exception e) {
            throw new RazorpayApiException("Error fetching order details from Razorpay for order ID: " + razorpayOrderId, e);
        }
    }

    private static String calculateRFC2104HMAC(String data, String key) throws SignatureException {
        try {
            SecretKeySpec signingKey = new SecretKeySpec(key.getBytes(), "HmacSHA256");
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(signingKey);
            return toHexString(mac.doFinal(data.getBytes()));
        } catch (Exception e) {
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