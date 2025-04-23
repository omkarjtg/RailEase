package com.railease.feedback.exception;

public class UnauthorizedFeedbackAccessException extends RuntimeException {
    public UnauthorizedFeedbackAccessException(String message) {
        super(message);
    }
}
