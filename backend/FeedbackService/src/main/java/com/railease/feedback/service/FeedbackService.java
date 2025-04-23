package com.railease.feedback.service;


import com.railease.feedback.dto.FeedbackDTO;
import com.railease.feedback.dto.FeedbackRequestDTO;
import com.railease.feedback.dto.FeedbackResponseDTO;
import com.railease.feedback.entity.Feedback;
import com.railease.feedback.entity.Role;
import com.railease.feedback.exception.FeedbackNotFoundException;
import com.railease.feedback.exception.ResourceNotFoundException;
import com.railease.feedback.exception.UnauthorizedFeedbackAccessException;
import com.railease.feedback.repo.FeedbackRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepo feedbackRepository;


    public FeedbackResponseDTO saveFeedback(FeedbackRequestDTO dto, Long userId) {
        Feedback feedback = new Feedback();
        feedback.setUserId(userId);
        feedback.setBookingId(dto.getBookingId());
        feedback.setComments(dto.getComments());
        feedback.setRating(dto.getRating());
        feedback.setTimestamp(LocalDateTime.now());

        Feedback savedFeedback = feedbackRepository.save(feedback);
        return mapToResponseDTO(savedFeedback);
    }

    public List<FeedbackResponseDTO> getFeedbacksByUser(Long userId) {
        List<Feedback> feedbacks = feedbackRepository.findByUserId(userId);
        return feedbacks.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<FeedbackResponseDTO> getAll() {
        List<Feedback> feedbacks = feedbackRepository.findAll();
        return feedbacks.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public FeedbackResponseDTO updateFeedback(Long id, FeedbackRequestDTO dto, Long userId) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Feedback not found"));

        if (!feedback.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Not authorized to update this feedback");
        }

        if (dto.getComments() != null && !dto.getComments().isBlank()) {
            feedback.setComments(dto.getComments());
        }
        if (dto.getRating() != null && dto.getRating() >= 0) {
            feedback.setRating(dto.getRating());
        }
        if (dto.getBookingId() != null) {
            feedback.setBookingId(dto.getBookingId());
        }

        Feedback updatedFeedback = feedbackRepository.save(feedback);
        return mapToResponseDTO(updatedFeedback);
    }

    public void deleteFeedbackById(Long id, Long userId, Role role) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new FeedbackNotFoundException("Feedback not found with id: " + id));

        if (!feedback.getUserId().equals(userId) && role != Role.ADMIN) {
            throw new UnauthorizedFeedbackAccessException("Not allowed to delete this feedback");
        }

        feedbackRepository.delete(feedback);
    }

    private FeedbackResponseDTO mapToResponseDTO(Feedback feedback) {
        FeedbackResponseDTO dto = new FeedbackResponseDTO();
        dto.setId(feedback.getId());
        dto.setUserId(feedback.getUserId());
        dto.setBookingId(feedback.getBookingId());
        dto.setComments(feedback.getComments());
        dto.setRating(feedback.getRating());
        dto.setTimestamp(feedback.getTimestamp());
        return dto;
    }

}
