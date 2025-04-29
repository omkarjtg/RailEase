package com.railease.booking.dto;

import com.railease.booking.entity.TrainDaysOfWeek;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TrainDTO {         //feign
        private Long trainId;
        private String name;
        private String number;
        private String source;
        private String destination;
        private int totalSeats;
        private double price;
        private Set<TrainDaysOfWeek> runningDays;
        private String duration;
        private LocalTime departureTime;
        private LocalTime arrivalTime;
    }
