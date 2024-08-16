package com.trainservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trainservice.entity.Train;
import com.trainservice.service.TrainService;

@RestController
@RequestMapping("/train")
@CrossOrigin("http://localhost:5173")
public class TrainController {
	
	@Autowired
	private TrainService trainService;
	
	@PostMapping
	public ResponseEntity<String> addTrain(@RequestBody Train train){
		trainService.addTrain(train);
//		System.out.println();
		return ResponseEntity.ok().body("Train Added");
	}
	
	@GetMapping
	public ResponseEntity<List<Train>> getAllTrains(){
		List<Train> allTrain = trainService.getAll();
		return ResponseEntity.ok().body(allTrain);
	}
	
	@GetMapping("/{number}")
	public ResponseEntity<Train> getTrainsByTrainNumber(String number){
		Train train = trainService.getTrain(number);
		return ResponseEntity.ok().body(train);
	}
	@PutMapping
	public ResponseEntity<String> updateTrain(@RequestBody Train train){
		// Send all the data otherwise remaning fields will become null
		trainService.updateTrain(train);
		return ResponseEntity.ok().body("Train updated");
	}
	@DeleteMapping("/{id}")
	public ResponseEntity<String> DeleteTrain(@PathVariable Long id){
		trainService.deleteTrain(id);
		return ResponseEntity.ok().body("Train deleted");
	}	
}
