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
        train.setDepartureTime(dto.getDepartureTime());
        train.setArrivalTime(dto.getArrivalTime());
        train.setTrainDaysOfWeek(dto.getRunningDays());

        return train;
    }

    public static TrainResponseDTO toResponseDTO(Train train) {
        TrainResponseDTO dto = new TrainResponseDTO();
        dto.setId(train.getId());
        dto.setName(train.getName());
        dto.setNumber(train.getNumber());
        dto.setSource(train.getSource());
        dto.setDestination(train.getDestination());
        dto.setTotalCoach(train.getTotalCoach());
        dto.setSeatPerCoach(train.getSeatPerCoach());
        dto.setTotalSeats(train.getTotalCoach() * train.getSeatPerCoach());
        dto.setPrice(train.getPrice());
        dto.setDepartureTime(train.getDepartureTime());
        dto.setArrivalTime(train.getArrivalTime());
        dto.setRunningDays(train.getTrainDaysOfWeek());

        Duration duration = Duration.between(train.getDepartureTime(), train.getArrivalTime());
        dto.setDuration(formatDuration(duration));

        return dto;
    }

    private static String formatDuration(Duration duration) {
        Duration positiveDuration = duration.abs();
        long hours = positiveDuration.toHours();
        long minutes = positiveDuration.toMinutesPart();
        return hours + "h " + minutes + "m";
    }
}