package com.trainservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.trainservice.entity.ScheduledTrain;
import com.trainservice.repository.ScheduledTrainRepository;

@Service
public class ScheduleTrainServiceImpl implements ScheduledTrainService {
	
	@Autowired
	private ScheduledTrainRepository scheduledTrainRepository;

	@Override
	public ResponseEntity<String> scheduleTrain(ScheduledTrain train) {
		train.setTotalSeats(train.getTotalCoach()*train.getSeatPerCoach());
		scheduledTrainRepository.save(train);
		return ResponseEntity.ok().body("Train Scheduled");
	}

	@Override
	public Integer getSeats(String number, String date) {
		System.out.println(number+" "+date);
		return scheduledTrainRepository.findByNumberAndSchedule(number, date).getTotalSeats();
	}

	@Override
	public List<ScheduledTrain> getAll() {
		return scheduledTrainRepository.findAll();
	}

	@Override
	public List<ScheduledTrain> getAllByDate(String date) {
		return scheduledTrainRepository.findBySchedule(date);
	}

	@Override
	public String updateSeats(Long id,Integer seats) {
		ScheduledTrain scheduledTrain = scheduledTrainRepository.findById(id).orElseThrow(()-> new RuntimeException("Couldn't find train"));
		scheduledTrain.setTotalSeats(scheduledTrain.getTotalSeats()-seats);
		scheduledTrainRepository.save(scheduledTrain);
		return "Seats Updated";
	}

}
