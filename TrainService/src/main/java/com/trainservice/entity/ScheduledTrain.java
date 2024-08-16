package com.trainservice.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ScheduledTrain {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private String name;
	private String number;
	private Integer totalCoach;
	private Integer seatPerCoach;
	private Integer totalSeats;
	private String source;
	private String destination;
	private String price;
	private String schedule;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getNumber() {
		return number;
	}
	public void setNumber(String number) {
		this.number = number;
	}
	public Integer getTotalSeats() {
		return totalSeats;
	}
	public void setTotalSeats(Integer totalSeats) {
		this.totalSeats = totalSeats;
	}
	public String getSource() {
		return source;
	}
	public void setSource(String source) {
		this.source = source;
	}
	public String getDestination() {
		return destination;
	}
	public void setDestination(String destination) {
		this.destination = destination;
	}
	public String getPrice() {
		return price;
	}
	public void setPrice(String price) {
		this.price = price;
	}
	public String getSchedule() {
		return schedule;
	}
	public void setSchedule(String schedule) {
		this.schedule = schedule;
	}
	public Integer getTotalCoach() {
		return totalCoach;
	}
	public void setTotalCoach(Integer totalCoach) {
		this.totalCoach = totalCoach;
	}
	public Integer getSeatPerCoach() {
		return seatPerCoach;
	}
	public void setSeatPerCoach(Integer seatPerCoach) {
		this.seatPerCoach = seatPerCoach;
	}
	
	
	
	

}
