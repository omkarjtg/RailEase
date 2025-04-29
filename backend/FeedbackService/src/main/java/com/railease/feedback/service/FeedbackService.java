package com.railease.feedback.service;

import com.railease.feedback.dto.BookingDTO;
import com.railease.feedback.dto.FeedbackRequestDTO;
import com.railease.feedback.dto.FeedbackResponseDTO;
import com.railease.feedback.dto.UserDTO;
import com.railease.feedback.entity.Feedback;
import com.railease.feedback.entity.Role;
import com.railease.feedback.feign.BookingClient;
import com.railease.feedback.feign.UserClient;
import com.railease.feedback.repo.FeedbackRepo;
import feign.FeignException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackService.class);

    @Autowired
    private FeedbackRepo feedbackRepository;

    @Autowired
    private BookingClient bookingClient;

    @Autowired
    private UserClient userClient;

    public FeedbackResponseDTO saveFeedback(FeedbackRequestDTO dto, Long userId) {
        logger.info("Saving feedback for userId: {}, bookingId: {}", userId, dto.getBookingId());
        Feedback feedback = new Feedback();
        feedback.setBookingId(dto.getBookingId());
        feedback.setComments(dto.getComments());
        feedback.setRating(dto.getRating());
        feedback.setUserId(userId);
        Feedback saved = feedbackRepository.save(feedback);
        return new FeedbackResponseDTO(saved.getId(), saved.getBookingId(), saved.getComments(), saved.getRating(), saved.getUserId());
    }

    public List<FeedbackResponseDTO> getFeedbacksByUser(Long userId) {
        logger.info("Fetching feedbacks for userId: {}", userId);
        return feedbackRepository.findByUserId(userId)
                .stream()
                .map(f -> new FeedbackResponseDTO(f.getId(), f.getBookingId(), f.getComments(), f.getRating(), f.getUserId()))
                .collect(Collectors.toList());
    }

    public List<FeedbackResponseDTO> getAll() {
        logger.info("Fetching all feedbacks");
        return feedbackRepository.findAll()
                .stream()
                .map(f -> new FeedbackResponseDTO(f.getId(), f.getBookingId(), f.getComments(), f.getRating(), f.getUserId()))
                .collect(Collectors.toList());
    }

    public FeedbackResponseDTO updateFeedback(Long id, FeedbackRequestDTO dto, Long userId) {
        logger.info("Updating feedback id: {} for userId: {}", id, userId);
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Feedback not found"));
        if (!feedback.getUserId().equals(userId)) {
            throw new IllegalArgumentException("User not authorized to update this feedback");
        }
        feedback.setComments(dto.getComments());
        feedback.setRating(dto.getRating());
        Feedback updated = feedbackRepository.save(feedback);
        return new FeedbackResponseDTO(updated.getId(), updated.getBookingId(), updated.getComments(), updated.getRating(), updated.getUserId());
    }

    public void deleteFeedbackById(Long id, Long userId, Role role) {
        logger.info("Deleting feedback id: {} for userId: {}", id, userId);
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Feedback not found"));
        if (!feedback.getUserId().equals(userId) && role != Role.ADMIN) {
            throw new IllegalArgumentException("User not authorized to delete this feedback");
        }
        feedbackRepository.deleteById(id);
    }

    public List<BookingDTO> getUserBookings(Long userId, String jwtToken) {
        logger.info("Fetching bookings for userId: {}", userId);
        try {
            ResponseEntity<List<BookingDTO>> response = bookingClient.getMyBookings("Bearer " + jwtToken);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                logger.error("Failed to fetch bookings for userId: {}", userId);
                throw new IllegalStateException("Unable to fetch bookings");
            }
        } catch (FeignException e) {
            logger.error("Feign error fetching bookings for userId: {}: {}", userId, e.getMessage());
            throw new IllegalStateException("Unable to fetch bookings", e);
        }
    }

    public UserDTO getUserDetails(Long userId, String jwtToken) {
        logger.info("Fetching user details for userId: {}", userId);
        try {
            ResponseEntity<UserDTO> response = userClient.getUserById(userId, "Bearer " + jwtToken);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                logger.error("Failed to fetch user details for userId: {}", userId);
                throw new IllegalStateException("Unable to fetch user details");
            }
        } catch (FeignException e) {
            logger.error("Feign error fetching user details for userId: {}: {}", userId, e.getMessage());
            throw new IllegalStateException("Unable to fetch user details", e);
        }
    }
}