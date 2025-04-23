package com.railease.trains.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TrainResponseDTO {
        private Long id;
        private String name;
        private String number;
        private String source;
        private String destination;
        private int totalSeats;
        private double price;
        private LocalDate schedule;
        private String duration;
}

