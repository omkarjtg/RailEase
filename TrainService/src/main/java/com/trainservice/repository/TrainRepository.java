package com.trainservice.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trainservice.entity.Train;

public interface TrainRepository extends JpaRepository<Train, Long> {
	
	List<Train> findBySourceAndDestinationAndSchedule(String source,String dest, Date date);
	Train findByNumber(String number);
}