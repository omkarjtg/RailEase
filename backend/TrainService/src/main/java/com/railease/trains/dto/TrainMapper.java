package com.railease.trains.dto;

import com.railease.trains.entity.Train;

import java.time.Duration;

public class TrainMapper {

    public static Train toEntity(TrainRequestDTO dto) {
        Train train = new Train();
        train.setName(dto.getName());
        train.setNumber(dto.getNumber());
        train.setSource(dto.getSource());
        train.setDestination(dto.getDestination());
        train.setTotalCoach(dto.getTotalCoach());
        train.setSeatPerCoach(dto.getSeatPerCoach());
        train.setPrice(dto.getPrice());
        train.setSchedule(dto.getSchedule());
        train.setDepartureTime(dto.getDepartureTime());
        train.setArrivalTime(dto.getArrivalTime());
        return train;
    }

    public static TrainResponseDTO toResponseDTO(Train train) {
        TrainResponseDTO dto = new TrainResponseDTO();
        dto.setId(train.getId());
        dto.setName(train.getName());
        dto.setNumber(train.getNumber());
        dto.setSource(train.getSource());
        dto.setDestination(train.getDestination());
        dto.setTotalSeats(train.getTotalCoach() * train.getSeatPerCoach());
        dto.setPrice(train.getPrice());
        dto.setSchedule(train.getSchedule());

        Duration duration = Duration.between(train.getDepartureTime(), train.getArrivalTime());
        dto.setDuration(formatDuration(duration));
        return dto;
    }

    private static String formatDuration(Duration duration) {
        long hours = duration.toHours();
        long minutes = duration.toMinutesPart();
        return hours + "h " + minutes + "m";
    }
}
