package com.bookingservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bookingservice.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
	
	List<Booking> findByCustomerId(Long id);
}
