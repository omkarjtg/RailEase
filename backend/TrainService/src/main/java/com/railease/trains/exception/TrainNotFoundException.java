package com.railease.trains.exception;

public class TrainNotFoundException extends RuntimeException {
	public TrainNotFoundException(String message) {
		super(message);
	}

}
