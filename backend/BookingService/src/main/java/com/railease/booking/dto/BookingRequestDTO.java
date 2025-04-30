package com.railease.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookingRequestDTO {
    private String trainNumber;
    private String seatTier;
    private Integer seatsBooked;
    private String travelDate;
}