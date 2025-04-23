package com.railease.payment.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {
    private Long bookingId;
    private Double amount;
    private String currency = "INR"; // optional default
    private String userEmail;
}
