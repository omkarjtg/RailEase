package com.trainbooking.feedbackservice.feedbackservice.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "feedback") 
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_name") 
    private String userName;

    @Column(name = "message") 
    private String message;
}
