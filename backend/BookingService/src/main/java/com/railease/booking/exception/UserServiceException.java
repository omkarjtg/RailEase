package com.railease.booking.exception;

import feign.FeignException;

public class UserServiceException extends RuntimeException {
    public UserServiceException(String unableToFetchUserDetails, FeignException e) {
    }
}
