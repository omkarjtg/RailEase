package com.railease.users.exception;

public class AuthenticationFailureException extends AuthException {
    public AuthenticationFailureException(String message) {
        super(message);
    }
}