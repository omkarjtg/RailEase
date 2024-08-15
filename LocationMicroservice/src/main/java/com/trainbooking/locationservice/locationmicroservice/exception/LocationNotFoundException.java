package com.trainbooking.locationservice.locationmicroservice.exception;

public class LocationNotFoundException extends RuntimeException{
    public LocationNotFoundException(String message) {
        super(message);
    }
}
