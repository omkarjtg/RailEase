package com.railease.feedback.repo;

import com.railease.feedback.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepo extends JpaRepository<Feedback, Long> {
    List<Feedback> findByUserId(Long userId);
}
