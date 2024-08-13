package com.trainbooking.locationservice.locationmicroservice.controller;

import com.trainbooking.locationservice.locationmicroservice.model.Location;
import com.trainbooking.locationservice.locationmicroservice.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/locations")
public class LocationController {
    private final LocationService locationService;

    @Autowired
    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @PostMapping("/add")
    public ResponseEntity<Location> createLocation(@RequestParam String name) {
        Location location = new Location();
        location.setCity(name);
        // Set other fields as needed
        return ResponseEntity.ok(locationService.saveLocation(location));
    }

    @GetMapping
    public ResponseEntity<List<Location>> getAllLocations() {
        return ResponseEntity.ok(locationService.findAllLocation());
    }
}
