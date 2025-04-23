package com.railease.location.repo;

import com.railease.location.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
        Optional<Location> findByCity(String city);
}

