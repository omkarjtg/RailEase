package com.railease.payment.feign;

import com.railease.payment.config.FeignClientConfig;
import com.railease.payment.dto.BookingDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "booking-service", configuration = FeignClientConfig.class, url = "${booking.service.url:http://localhost:8082}")
public interface BookingServiceClient {


    @PostMapping("/api/booking/confirm/{bookingId}") // Fixed path and changed to PostMapping
    void confirmBooking(@PathVariable("bookingId") Long bookingId);

    @GetMapping("/api/booking/{bookingId}")
    BookingDTO getBooking(@PathVariable("bookingId") Long bookingId);
}