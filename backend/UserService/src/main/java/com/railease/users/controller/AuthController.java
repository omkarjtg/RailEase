    package com.railease.users.controller;

    import com.railease.users.dto.*;
    import com.railease.users.model.User;
    import com.railease.users.repo.UserRepo;
    import com.railease.users.service.AuthService;
    import lombok.RequiredArgsConstructor;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.security.core.Authentication;
    import org.springframework.web.bind.annotation.*;

    @RestController
    @RequestMapping("/api/auth")
    @RequiredArgsConstructor
    @Slf4j
    public class AuthController {
        private final UserRepo userRepo;

        private final AuthService authService;

        @PostMapping("/login")
        public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest loginRequest) {
            log.info("Login attempt: {}", loginRequest.getIdentifier());
            TokenResponse tokenResponse = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(tokenResponse);
        }

        @PostMapping("/register")
        public ResponseEntity<TokenResponse> register(@RequestBody RegisterRequest registerRequest) {
            log.info("Register attempt: {}", registerRequest.getEmail());
            TokenResponse tokenResponse = authService.registerUser(registerRequest);
            return ResponseEntity.ok(tokenResponse);
        }

        @GetMapping("/profile")
        @PreAuthorize("isAuthenticated()")
        public ResponseEntity<ProfileDTO> getProfile(Authentication authentication) {
            String currentUsername = authentication.getName();
            User user = userRepo.findByUsername(currentUsername)
                    .orElseGet(() -> {
                        log.warn("User not found for username: {}", currentUsername);
                        return null;
                    });
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            ProfileDTO profile = new ProfileDTO(user);
            return ResponseEntity.ok(profile);
        }
    }