package com.railease.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long bookingId;
    private String trainNumber;
    private String seatTier;
    private Integer seatsBooked;
    private String travelDate;
    private String status;
    private Double bookedPrice;
    private Long userId;
    private String trainName;
    private String source;
    private String destination;
    private String departureTime;
    private String arrivalTime;
    private String bookingTime;
}