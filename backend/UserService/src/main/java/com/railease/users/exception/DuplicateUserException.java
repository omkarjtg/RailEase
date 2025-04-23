package com.railease.users.exception;

public class DuplicateUserException extends AuthException {
    public DuplicateUserException(String message) {
        super(message);
    }
}