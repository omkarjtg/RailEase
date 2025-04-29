package com.railease.feedback.controller;

import com.railease.feedback.dto.BookingDTO;
import com.railease.feedback.dto.FeedbackRequestDTO;
import com.railease.feedback.dto.FeedbackResponseDTO;
import com.railease.feedback.dto.UserDTO;
import com.railease.feedback.service.FeedbackService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class);

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<FeedbackResponseDTO> addFeedback(
            @RequestBody FeedbackRequestDTO dto, HttpServletRequest request) {
        UserDTO user = (UserDTO) request.getAttribute("user");
        if (user == null) {
            logger.error("UserDTO not found in request for POST /api/feedback");
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(feedbackService.saveFeedback(dto, user.getId()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<FeedbackResponseDTO>> getMyFeedbacks(HttpServletRequest request) {
        UserDTO user = (UserDTO) request.getAttribute("user");
        if (user == null) {
            logger.error("UserDTO not found in request for GET /api/feedback/my");
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(feedbackService.getFeedbacksByUser(user.getId()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FeedbackResponseDTO>> getAll() {
        logger.info("Received request for all feedbacks");
        return ResponseEntity.ok(feedbackService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeedbackResponseDTO> updateFeedback(
            @PathVariable Long id,
            @RequestBody FeedbackRequestDTO dto,
            HttpServletRequest request) {
        UserDTO user = (UserDTO) request.getAttribute("user");
        if (user == null) {
            logger.error("UserDTO not found in request for PUT /api/feedback/{}", id);
            return ResponseEntity.status(401).build();
        }
        try {
            FeedbackResponseDTO updatedFeedback = feedbackService.updateFeedback(id, dto, user.getId());
            return ResponseEntity.ok(updatedFeedback);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(404).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFeedbackById(
            @PathVariable Long id, HttpServletRequest request) {
        UserDTO user = (UserDTO) request.getAttribute("user");
        if (user == null) {
            logger.error("UserDTO not found in request for DELETE /api/feedback/{}", id);
            return ResponseEntity.status(401).build();
        }
        try {
            feedbackService.deleteFeedbackById(id, user.getId(), user.getRole());
            return ResponseEntity.ok("Deleted successfully for id: " + id);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body("Not authorized");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(404).body("Not found");
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDTO>> getUserBookings(HttpServletRequest request) {
        UserDTO user = (UserDTO) request.getAttribute("user");
        if (user == null) {
            logger.error("UserDTO not found in request for GET /api/feedback/bookings");
            return ResponseEntity.status(401).build();
        }
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.error("Authorization header missing or invalid for GET /api/feedback/bookings");
            return ResponseEntity.status(401).build();
        }
        String jwtToken = authHeader.substring(7);
        try {
            List<BookingDTO> bookings = feedbackService.getUserBookings(user.getId(), jwtToken);
            return ResponseEntity.ok(bookings);
        } catch (IllegalStateException e) {
            logger.error("Failed to fetch bookings for userId: {}: {}", user.getId(), e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }
}