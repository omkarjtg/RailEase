package com.trainbooking.locationservice.locationmicroservice.service;

import com.trainbooking.locationservice.locationmicroservice.exception.LocationNotFoundException;
import com.trainbooking.locationservice.locationmicroservice.model.Location;
import com.trainbooking.locationservice.locationmicroservice.repository.LocationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    public Location findByCity(String city) {
        return locationRepository.findByCity(city)
                .orElseThrow(() -> new LocationNotFoundException("Location not found for city: " + city));
    }

    public List<Location> findAllLocation() {
        return locationRepository.findAll();
    }

    public Location saveLocation(Location location) {
        return locationRepository.save(location);
    }


    public Optional<Location> findLocationById(Long id) {
        return locationRepository.findById(id);
    }

    public void deleteLocationById(Long id) {
        locationRepository.deleteById(id);
    }

    public void deleteAllLocations() {
        locationRepository.deleteAll();
    }


}
