package com.railease.trains.dto;

import com.railease.trains.entity.TrainDaysOfWeek;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
import java.util.Set;

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
        private Set<TrainDaysOfWeek> runningDays;
        private LocalTime departureTime;
        private LocalTime arrivalTime;
}

