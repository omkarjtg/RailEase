package com.railease.booking.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@ToString
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @NotNull
    private Long userId;

    @NotBlank
    private String trainNumber;

    @NotBlank
    private String trainName;

    @NotBlank
    private String source;

    @NotBlank
    private String destination;

    private double bookedPrice;

    @NotNull
    private LocalDate travelDate;

    @NotNull
    private LocalTime departureTime;

    @NotNull
    private LocalTime arrivalTime;

    @Min(1)
    private Integer seatsBooked;

    @NotNull
    private LocalDateTime bookingTime;

    @NotNull
    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @NotNull
    @Enumerated(EnumType.STRING)
    private SeatTier seatTier;



}
