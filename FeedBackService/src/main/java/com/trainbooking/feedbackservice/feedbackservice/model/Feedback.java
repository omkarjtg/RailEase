package com.trainbooking.feedbackservice.feedbackservice.model;

import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String userName;
    @Column
    private String message;
}
