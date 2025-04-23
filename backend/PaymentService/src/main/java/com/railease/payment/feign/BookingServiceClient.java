package com.railease.payment.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "booking-service", url = "${booking.service.url:http://localhost:8080}")
public interface BookingServiceClient {

    @PutMapping("/api/bookings/confirm/{bookingId}")
    void confirmBooking(@PathVariable("bookingId") Long bookingId);
}