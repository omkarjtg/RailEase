package com.railease.booking.repo;

import java.time.LocalDateTime;
import java.util.List;

import com.railease.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import com.railease.booking.entity.Booking;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    List<Booking> findByStatusAndBookingTimeBefore(BookingStatus bookingStatus, LocalDateTime expiryThreshold);
}
