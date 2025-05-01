package com.railease.payment.controller;

import com.railease.payment.dto.PaymentRequest;
import com.railease.payment.dto.PaymentVerificationRequest;
import com.railease.payment.exception.BookingServiceException;
import com.railease.payment.exception.RazorpayApiException;
import com.railease.payment.exception.SignatureVerificationException;
import com.railease.payment.service.PaymentService;
import com.razorpay.RazorpayException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody PaymentRequest request) {
        try {
            Map<String, Object> order = paymentService.createOrder(request);
            return ResponseEntity.ok(order);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        } catch (BookingServiceException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("success", false, "error", "Booking service unavailable: " + e.getMessage()));
        } catch (RazorpayException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", "Failed to create payment order: " + e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        try {
            Map<String, Object> result = paymentService.verifyPayment(
                    request.getOrderId(),
                    request.getPaymentId(),
                    request.getSignature()
            );
            return ResponseEntity.ok(result);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", "Internal server error"));
        }
    }

    @GetMapping("/order-date/{razorpayOrderId}")
    public ResponseEntity<?> getOrderDate(@PathVariable String razorpayOrderId) {
        try {
            LocalDateTime creationTime = paymentService.getOrderCreationTime(razorpayOrderId);
            return ResponseEntity.ok(creationTime);
        } catch (RazorpayApiException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}