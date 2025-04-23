package com.railease.payment.controller;


import com.railease.payment.dto.PaymentRequest;
import com.railease.payment.service.PaymentService;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public String createOrder(@RequestBody PaymentRequest paymentRequest) throws RazorpayException {
        return paymentService.createOrder(paymentRequest);
    }

    @PostMapping("/verify")
    public boolean verifyPayment(@RequestBody Map<String, String> payload) {
        String orderId = payload.get("orderId");
        String paymentId = payload.get("paymentId");
        String signature = payload.get("signature");

        return paymentService.verifyPayment(orderId, paymentId, signature);
    }

    @GetMapping("/order-date/{razorpayOrderId}")
    public LocalDateTime getOrderDate(@PathVariable String razorpayOrderId) {
        return paymentService.getOrderCreationTime(razorpayOrderId);
    }
}