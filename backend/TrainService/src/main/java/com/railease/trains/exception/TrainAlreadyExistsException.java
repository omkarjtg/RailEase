package com.railease.trains.exception;

public class TrainAlreadyExistsException extends RuntimeException {
    public TrainAlreadyExistsException(String message) {
        super(message);
    }
}
