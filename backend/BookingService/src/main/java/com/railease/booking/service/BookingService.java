package com.railease.booking.service;

import com.railease.booking.dto.NotificationRequest;
import com.railease.booking.dto.TrainDTO;
import com.railease.booking.dto.UserDTO;
import com.railease.booking.entity.Booking;
import com.railease.booking.entity.BookingStatus;
import com.railease.booking.entity.Role;
import com.railease.booking.exception.*;
import com.railease.booking.feign.NotificationFeignClient;
import com.railease.booking.feign.TrainClient;
import com.railease.booking.feign.UserClient;
import com.railease.booking.repo.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import feign.FeignException;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingService.class);

    private final BookingRepository bookingRepository;
    private final NotificationFeignClient notificationFeignClient;
    private final TrainClient trainClient;
    private final UserClient userClient;



    @Transactional
    public Booking book(Booking booking, UserDTO user) {
        log.info("Creating booking for user {} and train {}", user.getId(), booking.getTrainNumber());

        booking.setUserId(user.getId());
        booking.setStatus(BookingStatus.CONFIRMED);

        TrainDTO train;
        try {
            train = trainClient.getTrain(booking.getTrainNumber());
            if (train == null) {
                log.error("Train {} not found", booking.getTrainNumber());
                throw new TrainNotFoundException("Train not found");
            }
        } catch (FeignException e) {
            log.error("Failed to fetch train {}: {}", booking.getTrainNumber(), e.getMessage());
            throw new TrainServiceException("Unable to fetch train details", e);
        }

        Booking savedBooking = bookingRepository.save(booking);

        NotificationRequest request = new NotificationRequest();
        request.setTo(user.getEmail());
        request.setType("BOOKING_CONFIRMATION");
        request.setData(Map.of(
                "userName", user.getName(),
                "trainName", train.getName(),
                "source", train.getSource(),
                "destination", train.getDestination(),
                "schedule", train.getSchedule().toString(),
                "departureTime", train.getDepartureTime().toString(),
                "bookingId", savedBooking.getId()
        ));

        try {
            notificationFeignClient.sendNotification(request);
            log.info("Booking confirmation sent to {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send booking confirmation to {}: {}", user.getEmail(), e.getMessage());
            // Optionally throw NotificationFailureException if you want to fail the booking
            // throw new NotificationFailureException("Failed to send booking confirmation", e);
        }

        return savedBooking;
    }

    public List<Booking> getBookingsByUser(Long userId) {
        log.info("Fetching bookings for user {}", userId);
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAll() {
        log.info("Fetching all bookings");
        return bookingRepository.findAll();
    }

    @Transactional
    public boolean cancelBooking(Long bookingId, UserDTO user) {
        log.info("Attempting to cancel booking {} for user {}", bookingId, user.getId());

        return bookingRepository.findById(bookingId)
                .map(booking -> {
                    if (!booking.getUserId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
                        log.warn("Unauthorized cancellation attempt for booking {} by user {}", bookingId, user.getId());
                        throw new UnauthorizedBookingOperationException("User not authorized to cancel this booking");
                    }

                    if (booking.getStatus() == BookingStatus.CANCELLED) {
                        log.warn("Booking {} is already cancelled", bookingId);
                        throw new BookingAlreadyCancelledException("Booking is already cancelled");
                    }

                    TrainDTO train;
                    try {
                        train = trainClient.getTrain(booking.getTrainNumber());
                        if (train == null) {
                            log.error("Train {} not found for booking {}", booking.getTrainNumber(), bookingId);
                            throw new TrainNotFoundException("Train not found");
                        }
                    } catch (FeignException e) {
                        log.error("Failed to fetch train {} for booking {}: {}", booking.getTrainNumber(), bookingId, e.getMessage());
                        throw new TrainServiceException("Unable to fetch train details", e);
                    }

                    NotificationRequest request = new NotificationRequest();
                    request.setTo(user.getEmail());
                    request.setType("BOOKING_CANCELLATION");
                    request.setData(Map.of(
                            "userName", user.getName(),
                            "trainName", train.getName(),
                            "source", train.getSource(),
                            "destination", train.getDestination(),
                            "schedule", train.getSchedule().toString(),
                            "departureTime", train.getDepartureTime().toString(),
                            "bookingId", bookingId
                    ));

                    try {
                        notificationFeignClient.sendNotification(request);
                        log.info("Cancellation notification sent to {}", user.getEmail());
                    } catch (Exception e) {
                        log.error("Failed to send cancellation notification to {}: {}", user.getEmail(), e.getMessage());
                        // Optionally throw NotificationFailureException
                        // throw new NotificationFailureException("Failed to send cancellation notification", e);
                    }

                    booking.setStatus(BookingStatus.CANCELLED);
                    bookingRepository.save(booking);
                    log.info("Booking {} cancelled successfully", bookingId);
                    return true;
                })
                .orElseThrow(() -> {
                    log.error("Booking {} not found", bookingId);
                    return new BookingNotFoundException("Booking not found");
                });
    }

    @Transactional
    public void markAsConfirmed(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
    }
}