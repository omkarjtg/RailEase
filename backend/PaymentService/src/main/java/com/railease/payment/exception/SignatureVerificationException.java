package com.railease.payment.exception;

public class SignatureVerificationException extends PaymentException {
  public SignatureVerificationException(String message) {
    super(message);
  }
}