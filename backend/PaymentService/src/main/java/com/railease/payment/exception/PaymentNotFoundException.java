package com.railease.payment.exception;

public class PaymentNotFoundException extends PaymentException {
    public PaymentNotFoundException(String message) {
        super(message);
    }
}