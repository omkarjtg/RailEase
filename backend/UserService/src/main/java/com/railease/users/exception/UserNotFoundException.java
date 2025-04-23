package com.railease.users.exception;

public class UserNotFoundException extends AuthException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
