package com.railease.users.service;

import com.railease.users.dto.*;
import com.railease.users.exception.*;
import com.railease.users.model.Role;
import com.railease.users.model.User;
import com.railease.users.repo.UserRepo;
import com.railease.users.utils.JwtUtil;
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

    private final UserRepo userRepo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public TokenResponse authenticateUser(LoginRequest loginRequest) {
        String identifier = loginRequest.getIdentifier().trim();
        String password = loginRequest.getPassword();

        User user = userRepo.findByUsername(identifier)
                .or(() -> userRepo.findByEmail(identifier))
                .orElseThrow(() -> new AuthException("Invalid username/email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            log.warn("Failed login for: {}", identifier);
            throw new AuthException("Invalid username/email or password");
        }
        String token = jwtUtil.generateToken(user.getUsername(), String.valueOf(user.getRole()),user.getId(), user.getEmail());
        return new TokenResponse(token, "Bearer", user.getRole().name());
    }

    @Transactional
    public TokenResponse registerUser(RegisterRequest request) {
        validateRegisterRequest(request);

        String email = request.getEmail().trim().toLowerCase();
        String username = request.getUsername().trim();
        String fullName = request.getFullName().trim();

        if (userRepo.existsByEmail(email)) {
            throw new DuplicateUserException("Email already in use");
        }
        if (userRepo.existsByUsername(username)) {
            throw new DuplicateUserException("Username already taken");
        }

        User newUser = User.builder()
                .fullName(fullName)
                .email(email)
                .username(username)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        try {
            userRepo.save(newUser);
            log.info("User registered: {} ({})", newUser.getUsername(), newUser.getEmail());
            String token = jwtUtil.generateToken(newUser.getUsername(), String.valueOf(newUser.getRole()),newUser.getId(), newUser.getEmail());
            return new TokenResponse(token, "Bearer", newUser.getRole().name());
        } catch (DataIntegrityViolationException e) {
            throw new DuplicateUserException("Email or username already exists");
        } catch (Exception e) {
            throw new UserRegistrationException("User registration failed", e);
        }
    }

    private void validateRegisterRequest(RegisterRequest request) {
        if (!StringUtils.hasText(request.getFullName())) {
            throw new InvalidRegisterRequestException("Full name is required");
        }
        if (!StringUtils.hasText(request.getEmail())) {
            throw new InvalidRegisterRequestException("Email is required");
        }
        if (!StringUtils.hasText(request.getUsername())) {
            throw new InvalidRegisterRequestException("Username is required");
        }
        if (!StringUtils.hasText(request.getPassword()) || request.getPassword().length() < 8) {
            throw new InvalidRegisterRequestException("Password must be at least 8 characters");
        }
        if (!isValidEmail(request.getEmail())) {
            throw new InvalidRegisterRequestException("Invalid email format");
        }
    }

    private boolean isValidEmail(String email) {
        return email.matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    }
}
