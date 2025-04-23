package com.railease.booking.controller;


import com.railease.booking.dto.UserDTO;
import com.railease.booking.entity.Booking;
import com.railease.booking.entity.Role;
import com.railease.booking.service.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> bookTicket(@RequestBody Booking booking, HttpServletRequest request) {
        UserDTO user = (UserDTO) request.getAttribute("user");
        Booking saved = bookingService.book(booking, user);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(HttpServletRequest request) {
        UserDTO user = (UserDTO) request.getAttribute("user");
        return ResponseEntity.ok(bookingService.getBookingsByUser(user.getId()));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings(HttpServletRequest request) {
        UserDTO user = (UserDTO) request.getAttribute("user");

        if (user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(bookingService.getAll());
    }

    @PutMapping("/confirm/{bookingId}")
    public ResponseEntity<String> confirmBooking(@PathVariable Long bookingId) {
        bookingService.markAsConfirmed(bookingId);
        return ResponseEntity.ok("Booking confirmed");
    }


    @PutMapping("/{id}/cancel")
    public ResponseEntity<String> cancelBooking(@PathVariable Long id, HttpServletRequest request) {
        UserDTO user = (UserDTO) request.getAttribute("user");
        boolean cancelled = bookingService.cancelBooking(id, user);
        return cancelled ? ResponseEntity.ok("Cancelled") : ResponseEntity.status(403).body("Not allowed");
    }

}
