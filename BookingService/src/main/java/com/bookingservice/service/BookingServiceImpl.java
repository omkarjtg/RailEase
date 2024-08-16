package com.bookingservice.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.bookingservice.dto.GetSeatsDto;
import com.bookingservice.entity.Booking;
import com.bookingservice.repository.BookingRepository;

@Service
public class BookingServiceImpl implements BookingService {
	
	@Autowired
	private BookingRepository bookingRepository;
	@Autowired
	private TrainService trainService;

	
	// 10 - 5
	// 5- cnf
	// 5- wait
	@Override
	public synchronized ResponseEntity<String> createBooking( Booking booking) {
		String bookingId = UUID.randomUUID().toString();
		GetSeatsDto seatDto = new GetSeatsDto(booking.getTrainNumber(),booking.getSchedule());
		Integer seats = trainService.getSeats(seatDto);
		if(booking.getSeats()<=seats) {
			booking.setStatus("Confirmed");
			bookingRepository.save(booking);
			trainService.updateSeats(booking.getScheduleTrainId(), booking.getSeats());
		}
		else {
			if(seats>0) {
				Booking bookCnf = new Booking(booking.getScheduleTrainId() ,booking.getTrainNumber(),booking.getCustomerId(),"Confirmed",bookingId,seats,booking.getSchedule());
				bookingRepository.save(bookCnf);
				trainService.updateSeats(booking.getScheduleTrainId(), seats);
			}
			Booking bookWait = new Booking(booking.getScheduleTrainId() ,booking.getTrainNumber(),booking.getCustomerId(),"Waiting",bookingId,booking.getSeats()-seats,booking.getSchedule());
			bookingRepository.save(bookWait);
		}
		return ResponseEntity.status(200).body("Booking Completed");
	}

	@Override
	public List<Booking> getCustBooking(Long id) {
		return bookingRepository.findByCustomerId(id);
	}

	@Override
	public ResponseEntity<String> cancelBooking(Long id) {
		Booking byId = bookingRepository.findById(id).orElseThrow(()-> new RuntimeException("Couldn't find the booking"));
		byId.setStatus("Cancelled");
		bookingRepository.save(byId);
		return null;
	}

}
