package com.railease.payment.exception;

public class RazorpayApiException extends PaymentException {
    public RazorpayApiException(String message, Throwable cause) {
        super(message, cause);
    }
}