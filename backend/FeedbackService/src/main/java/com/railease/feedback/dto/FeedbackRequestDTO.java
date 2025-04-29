package com.railease.feedback.dto;

import lombok.Data;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
public class FeedbackRequestDTO {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @Size(max = 500, message = "Comments cannot exceed 500 characters")
    private String comments;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private Integer rating;
}