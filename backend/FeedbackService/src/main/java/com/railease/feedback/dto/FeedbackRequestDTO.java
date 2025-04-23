package com.railease.feedback.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedbackRequestDTO {
    private Long bookingId;
    private String comments;
    private Integer rating;
}