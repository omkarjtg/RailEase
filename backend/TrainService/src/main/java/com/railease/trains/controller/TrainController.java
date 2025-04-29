package com.railease.trains.controller;

import com.railease.trains.dto.TrainRequestDTO;
import com.railease.trains.dto.TrainResponseDTO;
import com.railease.trains.entity.TrainDaysOfWeek;
import com.railease.trains.service.TrainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;


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

    @GetMapping("/id/{id}")
    public ResponseEntity<TrainResponseDTO> getTrainById(@PathVariable Long id) {
        return ResponseEntity.ok(trainService.getTrainById(id));
    }

    @GetMapping("/number/{number}")
    public ResponseEntity<TrainResponseDTO> getTrain(@PathVariable String number) {
        return ResponseEntity.ok(trainService.getTrainByNumber(number));
    }


    @GetMapping("/{src}/{dest}/{date}")
    public ResponseEntity<List<TrainResponseDTO>> getTrainsBySourceAndDestination(
            @PathVariable String src,
            @PathVariable String dest,
            @PathVariable String date) {
        try {
            // Parse the date into LocalDate
            LocalDate localDate = LocalDate.parse(date);
            // Call the consolidated method in the service
            List<TrainResponseDTO> trains = trainService.getByLocation(src, dest, localDate);
            return ResponseEntity.ok(trains);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{src}/{dest}/days/{day}")
    public ResponseEntity<List<TrainResponseDTO>> getTrainsBySourceAndDestinationAndDay(
            @PathVariable String src,
            @PathVariable String dest,
            @PathVariable String day) {
        try {
            // Convert the day string to TrainDaysOfWeek enum
            TrainDaysOfWeek daysOfWeek = TrainDaysOfWeek.fromString(day);
            List<TrainResponseDTO> trains = trainService.getByLocation(src, dest, daysOfWeek);
            return ResponseEntity.ok(trains);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }


    @PutMapping("/number/{number}")
    public ResponseEntity<TrainResponseDTO> updateByNumber(
            @PathVariable String number,
            @RequestBody TrainRequestDTO updatedTrain) {
        return ResponseEntity.ok(trainService.updateTrain(number, updatedTrain));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTrain(@PathVariable Long id) {
        return ResponseEntity.ok(trainService.deleteTrain(id));
    }
}

