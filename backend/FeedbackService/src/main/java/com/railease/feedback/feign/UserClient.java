package com.railease.feedback.feign;

import com.railease.feedback.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "user-service", url = "http://localhost:8081")
public interface UserClient {

    @GetMapping("/users/{id}")
    ResponseEntity<UserDTO> getUserById(
            @PathVariable("id") Long id,
            @RequestHeader("Authorization") String authorizationHeader);
}