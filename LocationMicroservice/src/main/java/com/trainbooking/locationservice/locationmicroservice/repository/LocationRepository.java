package com.trainbooking.locationservice.locationmicroservice.repository;

import com.trainbooking.locationservice.locationmicroservice.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {
Optional<Location> findByCity(String city);
}
