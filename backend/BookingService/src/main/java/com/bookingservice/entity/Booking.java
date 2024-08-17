package com.bookingservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Booking {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	private Long scheduleTrainId;
	private String trainNumber;
	private Long customerId;
	private String status;
	private String bookingId;
	private Integer seats;
	private String schedule;
	
	public Booking() {}
	
	public Booking(Long scheduleTrainId,String trainNumber, Long customerId, String status, String bookingId, Integer seats,
			String schedule) {
		super();
		this.scheduleTrainId = scheduleTrainId;
		this.trainNumber = trainNumber;
		this.customerId = customerId;
		this.status = status;
		this.bookingId = bookingId;
		this.seats = seats;
		this.schedule = schedule;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	public Long getScheduleTrainId() {
		return scheduleTrainId;
	}

	public void setScheduleTrainId(Long scheduleTrainId) {
		this.scheduleTrainId = scheduleTrainId;
	}

	public String getTrainNumber() {
		return trainNumber;
	}
	public void setTrainNumber(String trainNumber) {
		this.trainNumber = trainNumber;
	}
	public Long getCustomerId() {
		return customerId;
	}
	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getBookingId() {
		return bookingId;
	}
	public void setBookingId(String bookingId) {
		this.bookingId = bookingId;
	}
	public String getSchedule() {
		return schedule;
	}
	public void setSchedule(String schedule) {
		this.schedule = schedule;
	}
	public Integer getSeats() {
		return seats;
	}
	public void setSeats(Integer seats) {
		this.seats = seats;
	}

}
