package com.railease.trains.service;

import com.railease.trains.dto.TrainMapper;
import com.railease.trains.dto.TrainRequestDTO;
import com.railease.trains.dto.TrainResponseDTO;
import com.railease.trains.entity.Train;
import com.railease.trains.entity.TrainDaysOfWeek;
import com.railease.trains.exception.TrainAlreadyExistsException;
import com.railease.trains.exception.TrainNotFoundException;
import com.railease.trains.repository.TrainRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainService {

    private static final Logger logger = LoggerFactory.getLogger(TrainService.class);

    @Autowired
    private TrainRepository trainRepository;

    public List<TrainResponseDTO> getAll() {
        logger.info("Fetching all trains");
        return trainRepository.findAll()
                .stream()
                .map(TrainMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<TrainResponseDTO> getByLocation(String source, String destination, Object dayFilter) {
        logger.info("Fetching trains from {} to {}", source, destination);

        if (source == null || source.trim().isEmpty() || destination == null || destination.trim().isEmpty()) {
            logger.error("Invalid source or destination provided");
            throw new IllegalArgumentException("Source and destination cannot be null or empty");
        }

        if (dayFilter == null) {
            logger.error("Day filter cannot be null");
            throw new IllegalArgumentException("Day filter cannot be null");
        }

        List<Train> trains;

        if (dayFilter instanceof TrainDaysOfWeek) {
            // Fetch trains based on TrainDaysOfWeek
            TrainDaysOfWeek daysOfWeek = (TrainDaysOfWeek) dayFilter;
            logger.info("Fetching trains from {} to {} on {}", source, destination, daysOfWeek);
            trains = trainRepository.findBySourceAndDestinationAndTrainDaysOfWeek(source.trim(), destination.trim(), daysOfWeek);
        } else if (dayFilter instanceof LocalDate) {
            // Fetch trains based on LocalDate (converted to DayOfWeek)
            LocalDate date = (LocalDate) dayFilter;
            DayOfWeek dayOfWeek = date.getDayOfWeek();
            TrainDaysOfWeek daysOfWeek = TrainDaysOfWeek.fromString(dayOfWeek.name());
            logger.info("Fetching trains from {} to {} on {}", source, destination, daysOfWeek);
            trains = trainRepository.findBySourceAndDestinationAndTrainDaysOfWeek(source.trim(), destination.trim(), daysOfWeek);
        } else {
            throw new IllegalArgumentException("Invalid day filter type");
        }

        return trains.stream()
                .map(TrainMapper::toResponseDTO)
                .collect(Collectors.toList());
    }


    public TrainResponseDTO getTrainByNumber(String trainNumber) {
        logger.info("Fetching train with number: {}", trainNumber);
        return trainRepository.findByNumber(trainNumber)
                .map(TrainMapper::toResponseDTO)
                .orElseThrow(() -> {
                    logger.error("Train with number {} not found", trainNumber);
                    return new TrainNotFoundException("No such train exists");
                });
    }


    public List<TrainResponseDTO> getBySourceDestinationAndDay(String source, String destination, TrainDaysOfWeek day) {
        logger.info("Fetching trains from {} to {} on {}", source, destination, day);
        List<Train> trains = trainRepository.findBySourceAndDestinationAndTrainDaysOfWeek(source, destination, day);
        return trains.stream()
                .map(TrainMapper::toResponseDTO)
                .collect(Collectors.toList());
    }


    @Transactional
    public TrainResponseDTO addTrain(TrainRequestDTO dto) {
        logger.info("Adding train with number: {}", dto.getNumber());
        trainRepository.findByNumber(dto.getNumber()).ifPresent(t -> {
            logger.warn("Train with number {} already exists", dto.getNumber());
            throw new TrainAlreadyExistsException("Train already exists with this number");
        });
        Train train = TrainMapper.toEntity(dto);
        Train savedTrain = trainRepository.save(train);
        logger.info("Train with number {} added successfully", dto.getNumber());
        return TrainMapper.toResponseDTO(savedTrain);
    }

    @Transactional
    public TrainResponseDTO updateTrain(String trainNumber, TrainRequestDTO dto) {
        logger.info("Updating train number: {}", trainNumber);
        return trainRepository.findByNumber(trainNumber)
                .map(train -> {
                    Train updated = TrainMapper.toEntity(dto);
                    updated.setId(train.getId());
                    Train savedTrain = trainRepository.save(updated);
                    logger.info("Train with number {} updated successfully", trainNumber);
                    return TrainMapper.toResponseDTO(savedTrain);
                })
                .orElseThrow(() -> {
                    logger.error("Train with number {} not found", trainNumber);
                    return new TrainNotFoundException("No such train found");
                });
    }

    @Transactional
    public String deleteTrain(Long id) {
        logger.info("Deleting train with ID: {}", id);
        if (!trainRepository.existsById(id)) {
            logger.error("Train with ID {} not found", id);
            throw new TrainNotFoundException("Train with ID " + id + " not found");
        }
        trainRepository.deleteById(id);
        logger.info("Train with ID {} deleted successfully", id);

        return "Train with ID " + id + " successfully deleted";
    }

    public TrainResponseDTO getTrainById(Long id) {
        logger.info("Fetching train with ID: {}", id);
        Train train = trainRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Train with ID {} not found", id);
                    return new RuntimeException("Train not found with ID: " + id);
                });
        logger.info("Successfully fetched train with ID: {}", id);
        return TrainMapper.toResponseDTO(train);
    }
}