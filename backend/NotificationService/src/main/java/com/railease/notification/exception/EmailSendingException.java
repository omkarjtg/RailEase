package com.railease.notification.exception;

public class EmailSendingException extends NotificationException {
    public EmailSendingException(String message, Throwable cause) {
        super(message, cause);
    }
}
