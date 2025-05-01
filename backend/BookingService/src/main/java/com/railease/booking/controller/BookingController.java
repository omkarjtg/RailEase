package com.railease.booking.controller;

import com.railease.booking.dto.BookingDTO;
import com.railease.booking.dto.BookingRequestDTO;
import com.railease.booking.dto.UserDTO;
import com.railease.booking.entity.Booking;
import com.railease.booking.entity.Role;
import com.railease.booking.exception.BookingNotFoundException;
import com.railease.booking.exception.UserNotFoundException;
import com.railease.booking.exception.UserServiceException;
import com.railease.booking.feign.UserClient;
import com.railease.booking.dto.BookingMapper;
import com.railease.booking.service.BookingService;
import feign.FeignException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserClient userClient;
    private final BookingMapper bookingMapper;

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingRequestDTO bookingRequest, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            log.error("User ID not found in request for POST /api/booking");
            return ResponseEntity.status(401).build();
        }

        try {
            ResponseEntity<UserDTO> userResponse = userClient.getUserById(userId);
            if (!userResponse.getStatusCode().is2xxSuccessful() || userResponse.getBody() == null) {
                log.error("Failed to fetch user with ID {}", userId);
                throw new UserNotFoundException("User not found");
            }
            UserDTO user = userResponse.getBody();
            Booking booking = bookingMapper.toEntity(bookingRequest);
            Booking savedBooking = bookingService.book(booking, user);
            return ResponseEntity.ok(bookingMapper.toDTO(savedBooking));
        } catch (FeignException e) {
            log.error("Failed to fetch user {}: {}", userId, e.getMessage());
            throw new UserServiceException("Unable to fetch user details", e);
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingDTO>> getMyBookings(HttpServletRequest request) {
        UserDTO user = (UserDTO) request.getAttribute("user");
        if (user == null) {
            log.error("UserDTO not found in request for GET /api/booking/my");
            return ResponseEntity.status(401).build();
        }
        List<Booking> bookings = bookingService.getBookingsByUser(user.getId());
        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookingDTOs);
    }

    @PutMapping("/booking/{bookingId}/fail")
    public void failBooking(@PathVariable Long bookingId){
        bookingService.failBooking(bookingId);
    }

    @GetMapping("/all")
    public ResponseEntity<List<BookingDTO>> getAllBookings(HttpServletRequest request) {
        UserDTO user = (UserDTO) request.getAttribute("user");
        if (user == null) {
            log.error("UserDTO not found in request for GET /api/booking/all");
            return ResponseEntity.status(401).build();
        }
        if (user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        List<Booking> bookings = bookingService.getAll();
        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookingDTOs);
    }

    @GetMapping("/id/{bookingId}")
    public ResponseEntity<BookingDTO> getBooking(@PathVariable Long bookingId) {
        Booking booking = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(bookingMapper.toDTO(booking));
    }

    @PostMapping("/confirm/{bookingId}")
    public ResponseEntity<String> confirmBooking(@PathVariable Long bookingId) {
        try {
            bookingService.markAsConfirmed(bookingId);
            return ResponseEntity.ok("Booking confirmed");
        } catch (BookingNotFoundException e) {
            log.error("Booking not found for confirmation: {}", bookingId);
            return ResponseEntity.status(404).body("Booking not found");
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<String> cancelBooking(@PathVariable Long id, HttpServletRequest request) {
        UserDTO user = (UserDTO) request.getAttribute("user");
        if (user == null) {
            log.error("UserDTO not found in request for PUT /api/booking/{}/cancel", id);
            return ResponseEntity.status(401).build();
        }
        try {
            boolean cancelled = bookingService.cancelBooking(id, user);
            return cancelled ? ResponseEntity.ok("Cancelled") : ResponseEntity.status(403).body("Not allowed");
        } catch (BookingNotFoundException e) {
            log.error("Booking not found for cancellation: {}", id);
            return ResponseEntity.status(404).body("Booking not found");
        }
    }
}