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
        if (location == null ||
                location.getCity() == null || location.getCity().trim().isEmpty() ||
                location.getStationCode() == null || location.getStationCode().trim().isEmpty()) {
            log.warn("Invalid location data provided: {}", location);
            throw new IllegalArgumentException("Location, city name, and station code cannot be null or empty");
        }

        // Check for duplicate city
        locationRepository.findByCity(location.getCity()).ifPresent(existing -> {
            log.warn("Attempt to save duplicate location for city: {}", location.getCity());
            throw new LocationAlreadyExistsException("Location already exists for city: " + location.getCity());
        });

        // Check for duplicate station code
        locationRepository.findByStationCode(location.getStationCode()).ifPresent(existing -> {
            log.warn("Attempt to save duplicate station code: {}", location.getStationCode());
            throw new LocationAlreadyExistsException("Location already exists with station code: " + location.getStationCode());
        });

        log.info("Saving new location for city: {}, station code: {}", location.getCity(), location.getStationCode());
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

    public Location updateLocation(Long id, Location updatedLocation) {
        if (id == null || id <= 0) {
            log.warn("Invalid location ID provided for update: {}", id);
            throw new IllegalArgumentException("Location ID must be a positive number");
        }
        if (updatedLocation == null ||
                updatedLocation.getCity() == null || updatedLocation.getCity().trim().isEmpty() ||
                updatedLocation.getStationCode() == null || updatedLocation.getStationCode().trim().isEmpty()) {
            log.warn("Invalid location data provided for update: {}", updatedLocation);
            throw new IllegalArgumentException("Location, city name, and station code cannot be null or empty");
        }

        log.info("Attempting to update location with ID: {}", id);

        return locationRepository.findById(id)
                .map(existingLocation -> {
                    // Check for city name conflict
                    if (!existingLocation.getCity().equalsIgnoreCase(updatedLocation.getCity())) {
                        locationRepository.findByCity(updatedLocation.getCity()).ifPresent(conflict -> {
                            log.warn("City name conflict during update. Existing city: {}", updatedLocation.getCity());
                            throw new LocationAlreadyExistsException("Location already exists for city: " + updatedLocation.getCity());
                        });
                    }

                    // Check for station code conflict
                    if (!existingLocation.getStationCode().equalsIgnoreCase(updatedLocation.getStationCode())) {
                        locationRepository.findByStationCode(updatedLocation.getStationCode()).ifPresent(conflict -> {
                            log.warn("Station code conflict during update. Existing station code: {}", updatedLocation.getStationCode());
                            throw new LocationAlreadyExistsException("Location already exists with station code: " + updatedLocation.getStationCode());
                        });
                    }

                    // Update all fields
                    existingLocation.setCity(updatedLocation.getCity());
                    existingLocation.setState(updatedLocation.getState());
                    existingLocation.setPostalCode(updatedLocation.getPostalCode());
                    existingLocation.setStationCode(updatedLocation.getStationCode());

                    log.info("Updating location with ID: {}, city: {}, station code: {}",
                            id, existingLocation.getCity(), existingLocation.getStationCode());
                    return locationRepository.save(existingLocation);
                })
                .orElseThrow(() -> {
                    log.error("No location found with ID for update: {}", id);
                    return new LocationNotFoundException("No location found with ID: " + id);
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