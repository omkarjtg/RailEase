package com.bookingservice.service;

import com.bookingservice.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "userservice")
public interface UserServiceClient {

    @GetMapping("/user/username/{username}")
    UserDTO getUserByUsername(@PathVariable("username") String username);
}
