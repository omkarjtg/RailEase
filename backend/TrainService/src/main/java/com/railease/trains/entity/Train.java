package com.railease.trains.entity;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String number;
    private String source;
    private String destination;
    private Integer totalCoach;
    private Integer seatPerCoach;
    private double price;
    private LocalDate schedule;
    private LocalTime departureTime;
    private LocalTime arrivalTime;

}