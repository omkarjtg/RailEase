package com.trainservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trainservice.dto.GetSeatsDTO;
import com.trainservice.entity.ScheduledTrain;
import com.trainservice.service.ScheduledTrainService;

@RestController
@RequestMapping("/scheduledTrain")
@CrossOrigin("http://localhost:5173")
public class ScheduledTrainController {
	
	@Autowired
	private ScheduledTrainService scheduledTrainService;
	
	@PostMapping	
	public ResponseEntity<String> scheduleTrain(@RequestBody ScheduledTrain entity) {
		return scheduledTrainService.scheduleTrain(entity);
	}
	@PostMapping("/seats")
	public Integer getSeats(@RequestBody GetSeatsDTO seatsDto) {
		System.out.println(seatsDto.getDate());
		return scheduledTrainService.getSeats(seatsDto.getNumber(), seatsDto.getDate());
	}
	
	@GetMapping("/{src}/{dest}/{date}")
	public ResponseEntity<List<ScheduledTrain>> getTrains(String src,String dest,String date){
		List<ScheduledTrain> byLocation = scheduledTrainService.getByLocation(src, dest, date);
		return ResponseEntity.ok().body(byLocation);
	}
	
	@GetMapping
	public List<ScheduledTrain> getAll(){
		return scheduledTrainService.getAll();
	}
	@GetMapping("/{date}")
	public List<ScheduledTrain> getAllByDate(@PathVariable String date){
		return scheduledTrainService.getAllByDate(date);
	}
	
	@GetMapping("/updateSeat/{id}/{seats}")
	public String updateSeats(@PathVariable Long id,@PathVariable Integer seats) {
		return scheduledTrainService.updateSeats(id, seats);
	}
}
