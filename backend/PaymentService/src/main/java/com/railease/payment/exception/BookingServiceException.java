package com.railease.payment.exception;

public class BookingServiceException extends PaymentException {
    public BookingServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}