package com.railease.feedback.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FeedbackDTO {
    private Long id;
    private Long userId;
    private Long bookingId;
    private String comments;
    private Integer rating;
    private LocalDateTime timestamp;
}
