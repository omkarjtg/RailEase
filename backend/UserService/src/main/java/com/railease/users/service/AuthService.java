package com.railease.users.service;

import com.railease.users.dto.*;
import com.railease.users.exception.*;
import com.railease.users.model.Role;
import com.railease.users.model.User;
import com.railease.users.repo.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepo userRepo;

    private void validateRegisterRequest(RegisterRequest request) {
        if (!StringUtils.hasText(request.getEmail())) {
            throw new InvalidRegisterRequestException("Email is required");
        }

        if (!StringUtils.hasText(request.getUsername())) {
            throw new InvalidRegisterRequestException("Username is required");
        }

        if (!StringUtils.hasText(request.getPassword()) || request.getPassword().length() < 8) {
            throw new InvalidRegisterRequestException("Password must be at least 8 characters long");
        }

        if (!isValidEmail(request.getEmail())) {
            throw new InvalidRegisterRequestException("Invalid email format");
        }
    }

    private boolean isValidEmail(String email) {
        return email.matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    }

    @Transactional
    public User registerUser(RegisterRequest request) {
        validateRegisterRequest(request);
        checkForDuplicates(request.getEmail(), request.getUsername());

        User user = User.builder()
                .username(request.getUsername().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        try {
            User savedUser = userRepo.save(user);
            log.info("User registered: {}", savedUser.getEmail());
            return savedUser;
        } catch (DataIntegrityViolationException e) {
            log.error("Constraint violation", e);
            throw new DuplicateUserException("Email or username already in use");
        } catch (Exception e) {
            log.error("Registration error", e);
            throw new UserRegistrationException("Registration failed", e);
        }
    }

    @Transactional
    public User authenticate(String identifier, String password) {
        var user = userRepo.findByEmail(identifier.trim().toLowerCase())
                .or(() -> userRepo.findByUsername(identifier.trim()));

        if (user.isEmpty() || !passwordEncoder.matches(password, user.get().getPassword())) {
            log.warn("Login failed for: {}", identifier);
            throw new AuthException("Invalid credentials");
        }

        log.info("Login successful: {}", user.get().getEmail());
        return user.get();
    }

    private void checkForDuplicates(String email, String username) {
        if (userRepo.existsByEmail(email.trim().toLowerCase())) {
            throw new DuplicateUserException("Email already in use");
        }
        if (userRepo.existsByUsername(username.trim())) {
            throw new DuplicateUserException("Username already taken");
        }
    }

    public ProfileDTO getProfile(String username) {
        return userRepo.findByUsername(username)
                .map(ProfileDTO::new)
                .orElse(null);
    }
}
