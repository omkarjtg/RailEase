package com.railease.booking.dto;

import com.railease.booking.entity.Booking;
import com.railease.booking.entity.SeatTier;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@Getter
@Setter

public class BookingMapper {

    public Booking toEntity(BookingRequestDTO dto) {
        Booking booking = new Booking();
        booking.setTrainNumber(dto.getTrainNumber());
        booking.setSeatTier(SeatTier.valueOf(dto.getSeatTier()));
        booking.setSeatsBooked(dto.getSeatsBooked());
        booking.setTravelDate(LocalDate.parse(dto.getTravelDate()));
        return booking;
    }

    public BookingDTO toDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setBookingId(booking.getBookingId());
        dto.setTrainNumber(booking.getTrainNumber());
        dto.setSeatTier(booking.getSeatTier().name());
        dto.setSeatsBooked(booking.getSeatsBooked());
        dto.setTravelDate(booking.getTravelDate().toString());
        dto.setStatus(booking.getStatus().name());
        dto.setBookedPrice(booking.getBookedPrice());
        dto.setUserId(booking.getUserId());
        dto.setTrainName(booking.getTrainName());
        dto.setSource(booking.getSource());
        dto.setDestination(booking.getDestination());
        dto.setDepartureTime(booking.getDepartureTime().toString());
        dto.setArrivalTime(booking.getArrivalTime().toString());
        dto.setBookingTime(booking.getBookingTime().toString());
        return dto;
    }
}