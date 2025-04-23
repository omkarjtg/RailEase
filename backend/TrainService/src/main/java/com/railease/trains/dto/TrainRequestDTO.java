package com.railease.trains.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class TrainRequestDTO {
        private String name;
        private String number;
        private String source;
        private String destination;
        private int totalCoach;
        private int seatPerCoach;
        private double price;
        private LocalDate schedule;
        private LocalTime departureTime;
        private LocalTime arrivalTime;
}

