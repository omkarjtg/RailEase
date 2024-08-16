package com.bookingservice.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.bookingservice.dto.GetSeatsDto;

@FeignClient(url = "http://localhost:9090",value="Train-client")
public interface TrainService {
	
	@PostMapping("/scheduledTrain/seats")
	public Integer getSeats(@RequestBody GetSeatsDto dto);
	
	@GetMapping("/scheduledTrain/updateSeat/{id}/{seats}")
	public String updateSeats(@PathVariable Long id, @PathVariable Integer seats);
	
	
}
