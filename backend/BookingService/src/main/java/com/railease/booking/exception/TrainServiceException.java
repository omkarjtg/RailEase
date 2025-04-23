package com.railease.booking.exception;

public class TrainServiceException extends BookingException {
  public TrainServiceException(String message, Throwable cause) {
    super(message, cause);
  }
}