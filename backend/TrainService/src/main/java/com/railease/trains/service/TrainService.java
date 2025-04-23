package com.railease.trains.service;

import com.railease.trains.dto.TrainMapper;
import com.railease.trains.dto.TrainRequestDTO;
import com.railease.trains.dto.TrainResponseDTO;
import com.railease.trains.entity.Train;
import com.railease.trains.exception.TrainAlreadyExistsException;
import com.railease.trains.exception.TrainNotFoundException;
import com.railease.trains.repository.TrainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainService {

    @Autowired
    private TrainRepository trainRepository;

    public List<TrainResponseDTO> getAll(){
        return trainRepository.findAll()
                .stream()
                .map(TrainMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<TrainResponseDTO> getByLocation(String source, String destination, LocalDate date){
        return trainRepository.findBySourceAndDestinationAndSchedule(source, destination, Date.valueOf(date))
                .stream()
                .map(TrainMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public TrainResponseDTO getTrainByNumber(String trainNumber){
        return trainRepository.findByNumber(trainNumber)
                .map(TrainMapper::toResponseDTO)
                .orElseThrow(() -> new TrainNotFoundException("No such train exists"));
    }

    public TrainResponseDTO addTrain(TrainRequestDTO dto){
        trainRepository.findByNumber(dto.getNumber()).ifPresent(t -> {
            throw new TrainAlreadyExistsException("Train already exists with this number");
        });
        Train train = TrainMapper.toEntity(dto);
        return TrainMapper.toResponseDTO(trainRepository.save(train));
    }

    public TrainResponseDTO updateTrain(Long trainId, TrainRequestDTO dto) {
        return trainRepository.findById(trainId)
                .map(train -> {
                    Train updated = TrainMapper.toEntity(dto);
                    updated.setId(trainId);
                    return TrainMapper.toResponseDTO(trainRepository.save(updated));
                })
                .orElseThrow(() -> new TrainNotFoundException("No such train found"));
    }

    public String deleteTrain(Long id) {
        trainRepository.deleteById(id);
        return "Deleted";
    }
}

