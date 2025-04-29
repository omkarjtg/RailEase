package com.railease.trains.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;
import java.util.Set;

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

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "train_days", joinColumns = @JoinColumn(name = "train_id"))
    @Column(name = "day_of_week")
    @Enumerated(EnumType.STRING)
    private Set<TrainDaysOfWeek> trainDaysOfWeek;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
}