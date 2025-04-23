package com.railease.trains.controller;

import com.railease.trains.dto.TrainRequestDTO;
import com.railease.trains.dto.TrainResponseDTO;
import com.railease.trains.entity.Train;
import com.railease.trains.service.TrainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/trains")
public class TrainController {

    @Autowired
    private TrainService trainService;

    @GetMapping
    public ResponseEntity<List<TrainResponseDTO>> getAllTrains() {
        return ResponseEntity.ok(trainService.getAll());
    }

    @PostMapping
    public ResponseEntity<TrainResponseDTO> addTrain(@RequestBody TrainRequestDTO train) {
        return ResponseEntity.ok(trainService.addTrain(train));
    }

    @GetMapping("/{number}")
    public ResponseEntity<TrainResponseDTO> getTrain(@PathVariable String number) {
        return ResponseEntity.ok(trainService.getTrainByNumber(number));
    }

    @GetMapping("/{src}/{dest}/{date}")
    public ResponseEntity<List<TrainResponseDTO>> getTrainsBySourceAndDestination(
            @PathVariable String src,
            @PathVariable String dest,
            @PathVariable String date) {
        return ResponseEntity.ok(trainService.getByLocation(src, dest, LocalDate.parse(date)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainResponseDTO> updateTrain(
            @PathVariable Long id,
            @RequestBody TrainRequestDTO updatedTrain) {
        return ResponseEntity.ok(trainService.updateTrain(id, updatedTrain));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTrain(@PathVariable Long id) {
        return ResponseEntity.ok(trainService.deleteTrain(id));
    }
}

