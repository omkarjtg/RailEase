package com.railease.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TrainDTO {
        private Long TrainId;
        private String name;
        private String source;
        private String destination;
        private LocalDate schedule;
        private LocalTime departureTime;
    }
