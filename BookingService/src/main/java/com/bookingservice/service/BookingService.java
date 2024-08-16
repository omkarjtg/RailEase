package com.bookingservice.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.bookingservice.entity.Booking;

public interface BookingService {
	
	ResponseEntity<String> createBooking(Booking booking);
	List<Booking> getCustBooking(Long id);
	ResponseEntity<String> cancelBooking(Long id);

}
