package com.railease.feedback.dto;

import com.railease.feedback.entity.Feedback;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FeedbackResponseDTO {
    private Long id;
    private Long userId;
    private Long bookingId;
    private String comments;
    private Integer rating;
    private LocalDateTime timestamp;

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