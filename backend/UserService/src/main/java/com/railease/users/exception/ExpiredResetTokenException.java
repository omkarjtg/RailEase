package com.railease.users.exception;

public class ExpiredResetTokenException extends RuntimeException {
    public ExpiredResetTokenException(String message) {
        super(message);
    }
}
