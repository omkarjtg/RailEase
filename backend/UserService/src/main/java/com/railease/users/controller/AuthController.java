package com.railease.users.controller;

import com.railease.users.dto.*;
import com.railease.users.service.AuthService;
import com.railease.users.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            var user = authService.registerUser(request);

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword())
            );

            if (authentication.isAuthenticated()) {
                String token = jwtUtil.generateToken(user);
                return new ResponseEntity<>(new TokenResponse(token), HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("User created but auto-login failed", HttpStatus.OK);
            }

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong. Please try again.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            var user = authService.authenticate(request.getIdentifier(), request.getPassword());
            String token = jwtUtil.generateToken(user);
            return ResponseEntity.ok(new TokenResponse(token));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something went wrong. Please try again.");
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileDTO> getProfile(Authentication authentication) {
        var profile = authService.getProfile(authentication.getName());
        return profile != null ? ResponseEntity.ok(profile) : ResponseEntity.notFound().build();
    }
}
