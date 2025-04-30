package com.railease.payment.feign;

import com.railease.payment.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service")
public interface UserFeignClient {
    @GetMapping("api/auth/users/{id}")
    ResponseEntity<UserDTO> getUserById(@PathVariable("id") Long id);
}