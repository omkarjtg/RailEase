package com.railease.booking.service;

import com.railease.booking.entity.Booking;
import com.railease.booking.entity.BookingStatus;
import com.railease.booking.repo.BookingRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingCleanupService {

    private final BookingRepository bookingRepository;
    private final Logger log = LoggerFactory.getLogger(BookingCleanupService.class);

    @Scheduled(fixedRate = 90000000)
    @Transactional
    public void cleanupExpiredBookings() {
        LocalDateTime expiryThreshold = LocalDateTime.now().minusMinutes(15);
        List<Booking> expiredBookings = bookingRepository.findByStatusAndBookingTimeBefore(
                BookingStatus.PENDING, expiryThreshold);

        for (Booking booking : expiredBookings) {
            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);
            log.info("Cancelled expired PENDING booking: {}", booking.getBookingId());
        }
    }
}