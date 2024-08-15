package com.trainbooking.feedbackservice.feedbackservice.controller;

import com.trainbooking.feedbackservice.feedbackservice.model.Feedback;
import com.trainbooking.feedbackservice.feedbackservice.sevice.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
