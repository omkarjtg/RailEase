package com.railease.users.exception;

public class InvalidRegisterRequestException extends AuthException {
    public InvalidRegisterRequestException(String message) {
        super(message);
    }
}
