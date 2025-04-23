package com.railease.booking.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.railease.booking.entity.Booking;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
}
