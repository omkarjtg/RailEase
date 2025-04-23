package com.railease.feedback.controller;


import com.railease.feedback.dto.FeedbackDTO;
import com.railease.feedback.dto.FeedbackRequestDTO;
import com.railease.feedback.dto.FeedbackResponseDTO;
import com.railease.feedback.dto.UserDTO;
import com.railease.feedback.entity.Feedback;
import com.railease.feedback.entity.Role;
import com.railease.feedback.service.FeedbackService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<FeedbackResponseDTO> addFeedback(
            @RequestBody FeedbackRequestDTO dto, HttpServletRequest request) {
        UserDTO user = (UserDTO) request.getAttribute("user");
        return ResponseEntity.ok(feedbackService.saveFeedback(dto, user.getId()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<FeedbackResponseDTO>> getMyFeedbacks(HttpServletRequest request) {
        UserDTO user = (UserDTO) request.getAttribute("user");
        return ResponseEntity.ok(feedbackService.getFeedbacksByUser(user.getId()));
    }

    @GetMapping("/all")
    public ResponseEntity<List<FeedbackResponseDTO>> getAll(HttpServletRequest request) {
        UserDTO user = (UserDTO) request.getAttribute("user");
        if (user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(feedbackService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeedbackResponseDTO> updateFeedback(
            @PathVariable Long id,
            @RequestBody FeedbackRequestDTO dto,
            HttpServletRequest request) {
        UserDTO user = (UserDTO) request.getAttribute("user");
        try {
            FeedbackResponseDTO updatedFeedback = feedbackService.updateFeedback(id, dto, user.getId());
            return ResponseEntity.ok(updatedFeedback);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).build(); // Forbidden if user not authorized
        } catch (IllegalStateException e) {
            return ResponseEntity.status(404).build(); // Not found if feedback doesn't exist
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFeedbackById(
            @PathVariable Long id, HttpServletRequest request) {
        UserDTO user = (UserDTO) request.getAttribute("user");
        try {
            feedbackService.deleteFeedbackById(id, user.getId(), user.getRole());
            return ResponseEntity.ok("Deleted successfully for id: " + id);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body("Not authorized");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(404).body("Not found");
        }
    }

}
