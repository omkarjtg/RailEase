package com.railease.feedback.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FeedbackResponseDTO {

    private Long id;
    private Long bookingId;
    private String comments;
    private Integer rating;
    private Long userId;
}