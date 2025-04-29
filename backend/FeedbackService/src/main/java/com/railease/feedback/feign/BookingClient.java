package com.railease.feedback.feign;

import com.railease.feedback.dto.BookingDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "booking-service", url = "http://localhost:8082")
public interface BookingClient {

    @GetMapping("/api/booking/my")
    ResponseEntity<List<BookingDTO>> getMyBookings(
            @RequestHeader("Authorization") String authorizationHeader);
}