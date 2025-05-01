package com.railease.feedback.dto;
import com.railease.feedback.entity.Status;
import lombok.Data;

@Data
public class BookingDTO {
    private Long bookingId;
    private Long userId;
    private Long trainId;
    private Status status;
    private String bookingDate;
}