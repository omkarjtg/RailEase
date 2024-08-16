package com.trainservice.service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.trainservice.entity.Train;
import com.trainservice.repository.TrainRepository;

@Service
public class TrainServiceImpl implements TrainService {
	
	@Autowired
	private TrainRepository trainRepository;

	@Override
	public String addTrain(Train train) {
		Train exists = trainRepository.findByNumber(train.getNumber());
		if(exists != null) {
			return "Train exists with this number";
		}
		trainRepository.save(train);
		return "Train added";
	}

	@Override
	public List<Train> getAll() {
		return trainRepository.findAll();
	}
	@Override
	public Train getTrain(String trainNumber) {
		return trainRepository.findByNumber(trainNumber);
	}

	@Override
	public String updateTrain(Train t) {
		trainRepository.save(t);
		return "Updated";
	}

	@Override
	public String deleteTrain(Long id) {
		trainRepository.deleteById(id);
		return "Deleted";
	}

}
