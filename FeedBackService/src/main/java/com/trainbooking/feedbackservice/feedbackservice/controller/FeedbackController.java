package com.trainbooking.feedbackservice.feedbackservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trainbooking.feedbackservice.feedbackservice.model.Feedback;
import com.trainbooking.feedbackservice.feedbackservice.service.FeedbackService;

@RestController
@RequestMapping("/feedback")
@CrossOrigin("http://localhost:5173")
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public String submitFeedback(@RequestBody Feedback feedback) {
      feedbackService.saveFeedback(feedback);
        return "saved correctly";
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        List<Feedback> feedbacks = feedbackService.getAllFeedback();
        return ResponseEntity.ok(feedbacks);
    }

    @DeleteMapping("/{id}")
    public String deleteFeedbackById(@PathVariable Long id) {
        feedbackService.deleteFeedbackById(id);
        return "deleted Succesfully for id:"+id;
    }
}
