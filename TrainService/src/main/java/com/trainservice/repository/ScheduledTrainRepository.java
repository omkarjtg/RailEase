package com.trainservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trainservice.entity.ScheduledTrain;

public interface ScheduledTrainRepository extends JpaRepository<ScheduledTrain, Long> {
	
	ScheduledTrain findByNumberAndSchedule(String number,String date);
	List<ScheduledTrain> findBySchedule(String date);

}
