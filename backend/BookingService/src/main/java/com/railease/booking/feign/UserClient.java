package com.railease.booking.feign;

import com.railease.booking.config.FeignClientConfig;
import com.railease.booking.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "user-service", configuration = FeignClientConfig.class, url = "http://localhost:8081")
public interface UserClient {

    @GetMapping("api/auth/users/{id}")
    ResponseEntity<UserDTO> getUserById(
            @PathVariable("id") Long id);
}