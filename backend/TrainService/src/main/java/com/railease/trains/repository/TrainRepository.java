package com.railease.trains.repository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.railease.trains.entity.Train;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainRepository extends JpaRepository<Train, Long> {
	List<Train> findBySourceAndDestinationAndSchedule(String source,String dest, Date date);
	Optional <Train> findByNumber(String number);
}