package com.railease.booking.feign;

import com.railease.booking.dto.TrainDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "TRAINSERVICE")
public interface TrainClient {
    @GetMapping("/api/trains/number/{trainNumber}")
    TrainDTO getTrain(@PathVariable String trainNumber);
}
