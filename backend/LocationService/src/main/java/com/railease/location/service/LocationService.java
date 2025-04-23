package com.railease.location.service;

import com.railease.location.entity.Location;
import com.railease.location.exception.LocationAlreadyExistsException;
import com.railease.location.exception.LocationNotFoundException;
import com.railease.location.repo.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationService {

    private static final Logger log = LoggerFactory.getLogger(LocationService.class);

    private final LocationRepository locationRepository;

    public Location findByCity(String city) {
        if (city == null || city.trim().isEmpty()) {
            log.warn("Invalid city name provided: {}", city);
            throw new IllegalArgumentException("City name cannot be null or empty");
        }
        log.info("Fetching location for city: {}", city);
        return locationRepository.findByCity(city)
                .orElseThrow(() -> {
                    log.error("Location not found for city: {}", city);
                    return new LocationNotFoundException("Location not found for the city: " + city);
                });
    }

    public List<Location> findAllLocations() {
        log.info("Fetching all locations");
        return locationRepository.findAll();
    }

    public Location saveLocation(Location location) {
        if (location == null || location.getCity() == null || location.getCity().trim().isEmpty()) {
            log.warn("Invalid location data provided: {}", location);
            throw new IllegalArgumentException("Location and city name cannot be null or empty");
        }
        locationRepository.findByCity(location.getCity()).ifPresent(existing -> {
            log.warn("Attempt to save duplicate location for city: {}", location.getCity());
            throw new LocationAlreadyExistsException("Location already exists for city: " + location.getCity());
        });
        log.info("Saving new location for city: {}", location.getCity());
        return locationRepository.save(location);
    }

    public Location findLocationById(Long locationId) {
        if (locationId == null || locationId <= 0) {
            log.warn("Invalid location ID provided: {}", locationId);
            throw new IllegalArgumentException("Location ID must be a positive number");
        }
        log.info("Fetching location by ID: {}", locationId);
        return locationRepository.findById(locationId)
                .orElseThrow(() -> {
                    log.error("No location found with ID: {}", locationId);
                    return new LocationNotFoundException("No location found with ID: " + locationId);
                });
    }

    public void deleteLocationById(Long locationId) {
        if (locationId == null || locationId <= 0) {
            log.warn("Invalid location ID provided for deletion: {}", locationId);
            throw new IllegalArgumentException("Location ID must be a positive number");
        }
        if (!locationRepository.existsById(locationId)) {
            log.error("No location found with ID for deletion: {}", locationId);
            throw new LocationNotFoundException("No location found with ID: " + locationId);
        }
        log.info("Deleting location with ID: {}", locationId);
        locationRepository.deleteById(locationId);
    }

    public void deleteAllLocations() {
        log.info("Deleting all locations");
        locationRepository.deleteAll();
    }
}