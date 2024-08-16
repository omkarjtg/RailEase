package com.trainservice.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.trainservice.entity.ScheduledTrain;

public interface ScheduledTrainService {
	
	ResponseEntity<String> scheduleTrain(ScheduledTrain train);
	Integer getSeats(String number, String date);
	List<ScheduledTrain> getAll();
	List<ScheduledTrain> getAllByDate(String date);
	String updateSeats(Long id, Integer seats);
	List<ScheduledTrain> getByLocation(String src, String dest, String date);

}
