package com.railease.location.controller;

import com.railease.location.entity.Location;
import com.railease.location.exception.LocationAlreadyExistsException;
import com.railease.location.exception.LocationNotFoundException;
import com.railease.location.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    @Autowired
    private LocationService locationService;


    @GetMapping("/city/{city}")
    public ResponseEntity<?> findByCity(@PathVariable String city) {
        try {
            Location location = locationService.findByCity(city);
            return ResponseEntity.ok(location);
        } catch (LocationNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Location>> findAllLocations() {
        return ResponseEntity.ok(locationService.findAllLocations());
    }

    @PostMapping
    public ResponseEntity<?> saveLocation(@RequestBody Location location) {
        try {
            Location savedLocation = locationService.saveLocation(location);
            return new ResponseEntity<>(savedLocation, HttpStatus.CREATED);
        } catch (LocationAlreadyExistsException | IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findLocationById(@PathVariable Long id) {
        try {
            Location location = locationService.findLocationById(id);
            return ResponseEntity.ok(location);
        } catch (LocationNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLocationById(@PathVariable Long id) {
        try {
            locationService.deleteLocationById(id);
            return ResponseEntity.ok("Location deleted successfully");
        } catch (LocationNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAllLocations() {
        locationService.deleteAllLocations();
        return ResponseEntity.ok("All locations deleted successfully");
    }
}