package com.railease.trains.repository;

import com.railease.trains.entity.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface TrainRepository extends JpaRepository<Train, Long> {
	List<Train> findBySourceAndDestinationAndSchedule(String source,String dest, Date date);
	Optional <Train> findByNumber(String number);
}