package com.bookingservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookingservice.dto.UserDTO;
import com.bookingservice.entity.Booking;
import com.bookingservice.service.BookingService;
import com.bookingservice.service.UserServiceClient;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/booking")
public class BookingController {
	
	@Autowired
	private BookingService bookingService;
	
	@Autowired
	private UserServiceClient userServiceClient;

	@PostMapping
	public ResponseEntity<String> createBooking(@RequestBody Booking booking) {
	    UserDTO user = userServiceClient.getUserByUsername("someUsername");
	    booking.setCustomerId(user.getId());
	    return bookingService.createBooking(booking);
	}

	
	@GetMapping("/{id}")
	public List<Booking> getCustBooking(@PathVariable Long id){
		return bookingService.getCustBooking(id);
	}
	@DeleteMapping("/{id}")
	public ResponseEntity<String> cancelBooking(@PathVariable Long id) {
		return bookingService.cancelBooking(id);
	}
}
