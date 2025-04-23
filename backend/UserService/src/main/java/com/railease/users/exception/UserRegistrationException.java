package com.railease.users.exception;

public class UserRegistrationException extends AuthException {
    public UserRegistrationException(String message, Throwable cause) {
        super(message, cause);
    }
}