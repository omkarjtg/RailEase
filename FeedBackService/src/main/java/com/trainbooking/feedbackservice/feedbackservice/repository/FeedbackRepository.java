package com.trainbooking.feedbackservice.feedbackservice.repository;

import com.trainbooking.feedbackservice.feedbackservice.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}
