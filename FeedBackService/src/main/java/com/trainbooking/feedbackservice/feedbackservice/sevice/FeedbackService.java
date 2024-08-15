package com.trainbooking.feedbackservice.feedbackservice.sevice;

import com.trainbooking.feedbackservice.feedbackservice.model.Feedback;
import com.trainbooking.feedbackservice.feedbackservice.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.trainbooking.feedbackservice.feedbackservice.exception.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    public Feedback saveFeedback(Feedback feedback) {

        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getAllFeedback() {

        return feedbackRepository.findAll();
    }

    public void deleteFeedbackById(Long id) {
        Feedback feedback =feedbackRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Feedback not found with id"));
        feedbackRepository.delete(feedback);
    }
}
