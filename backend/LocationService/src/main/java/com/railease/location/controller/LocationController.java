package com.railease.location.controller;

import com.railease.location.entity.Location;
import com.railease.location.exception.LocationAlreadyExistsException;
import com.railease.location.exception.LocationNotFoundException;
import com.railease.location.service.LocationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private static final Logger log = LoggerFactory.getLogger(LocationController.class);
    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<Location> getLocationByCity(@PathVariable String city) {
        log.info("Request to get location by city: {}", city);
        try {
            Location location = locationService.findByCity(city);
            return ResponseEntity.ok(location);
        } catch (LocationNotFoundException e) {
            log.error("Location not found for city: {}", city);
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            log.warn("Invalid city parameter: {}", city);
            return ResponseEntity.badRequest().build();
        }
    }

            @GetMapping
    public ResponseEntity<List<Location>> getAllLocations() {
        log.info("Request to get all locations");
        List<Location> locations = locationService.findAllLocations();
        return ResponseEntity.ok(locations);
    }

    @PostMapping
    public ResponseEntity<Location> createLocation(@RequestBody Location location) {
        log.info("Request to create new location: city={}, stationCode={}",
                location.getCity(), location.getStationCode());
        try {
            Location savedLocation = locationService.saveLocation(location);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedLocation);
        } catch (LocationAlreadyExistsException e) {
            log.error("Location already exists: city={}, stationCode={}",
                    location.getCity(), location.getStationCode());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid location data provided: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Location> getLocationById(@PathVariable Long id) {
        log.info("Request to get location by ID: {}", id);
        try {
            Location location = locationService.findLocationById(id);
            return ResponseEntity.ok(location);
        } catch (LocationNotFoundException e) {
            log.error("Location not found for ID: {}", id);
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            log.warn("Invalid ID parameter: {}", id);
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Location> updateLocation(
            @PathVariable Long id,
            @RequestBody Location updatedLocation) {
        log.info("Request to update location with ID: {}, city={}, stationCode={}",
                id, updatedLocation.getCity(), updatedLocation.getStationCode());
        try {
            Location location = locationService.updateLocation(id, updatedLocation);
            return ResponseEntity.ok(location);
        } catch (LocationNotFoundException e) {
            log.error("Location not found for update with ID: {}", id);
            return ResponseEntity.notFound().build();
        } catch (LocationAlreadyExistsException e) {
            log.error("Conflict during update: city={}, stationCode={}",
                    updatedLocation.getCity(), updatedLocation.getStationCode());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid update data provided: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
        log.info("Request to delete location with ID: {}", id);
        try {
            locationService.deleteLocationById(id);
            return ResponseEntity.noContent().build();
        } catch (LocationNotFoundException e) {
            log.error("Location not found for deletion with ID: {}", id);
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            log.warn("Invalid ID parameter for deletion: {}", id);
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllLocations() {
        log.info("Request to delete all locations");
        locationService.deleteAllLocations();
        return ResponseEntity.noContent().build();
    }
}