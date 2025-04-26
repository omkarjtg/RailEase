package com.railease.users.service;

import com.railease.users.dto.NotificationRequest;
import com.railease.users.exception.ExpiredResetTokenException;
import com.railease.users.exception.InvalidResetTokenException;
import com.railease.users.exception.UserNotFoundException;
import com.railease.users.feign.NotificationFeignClient;
import com.railease.users.model.PasswordResetToken;
import com.railease.users.model.User;
import com.railease.users.repo.TokenRepository;
import com.railease.users.repo.UserRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class PasswordResetService {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);
    private static final int TOKEN_EXPIRY_MINUTES = 15;

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private NotificationFeignClient notificationClient;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public void initiateReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("Password reset requested for non-existent email: {}", email);
                    return new UserNotFoundException("User not found for email: " + email);
                });

        // Delete any existing tokens for the user
        tokenRepository.deleteByEmail(email);

        // Generate and save new token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setEmail(user.getEmail());
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(TOKEN_EXPIRY_MINUTES));
        tokenRepository.save(resetToken);

        // Send password reset email
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        NotificationRequest request = new NotificationRequest();
        request.setTo(email);
        request.setType("PASSWORD_RESET");
        request.setData(Map.of(
                "userName", user.getUsername(),
                "resetLink", resetLink
        ));

        try {
            notificationClient.sendNotification(request);
            logger.info("Sent password reset email to {} with token {}", email, token);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to {}: {}", email, e.getMessage());
            // Optionally rollback transaction if notification is critical
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        if (token == null || token.trim().isEmpty()) {
            logger.error("Password reset attempted with empty token");
            throw new InvalidResetTokenException("Token cannot be empty");
        }

        PasswordResetToken resetToken = tokenRepository.findByToken(token.trim())
                .orElseThrow(() -> {
                    logger.error("Invalid password reset token: {}", token);
                    return new InvalidResetTokenException("Invalid or non-existent token");
                });

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            logger.warn("Attempted reset with expired token: {}", token);
            throw new ExpiredResetTokenException("Token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
        logger.info("Password reset completed for user: {}", user.getEmail());
    }
}