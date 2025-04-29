package com.railease.trains.repository;

import com.railease.trains.entity.Train;
import com.railease.trains.entity.TrainDaysOfWeek;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainRepository extends JpaRepository<Train, Long> {
	public List<Train> findBySourceAndDestinationAndTrainDaysOfWeek(String source, String destination, TrainDaysOfWeek dayOfWeek);
	List<Train> findBySourceAndDestination(String source, String destination);
	Optional <Train> findByNumber(String number);
}