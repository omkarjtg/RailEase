package com.railease.feedback.dto;
import lombok.Data;

@Data
public class BookingDTO {
    private Long id;
    private Long userId;
    private Long trainId;
    private String status;
    private String bookingDate;
}