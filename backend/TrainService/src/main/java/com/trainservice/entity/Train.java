package com.trainservice.entity;

import java.sql.Date;
import java.sql.Time;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Train {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private String name;
	private String number;
	private Integer totalCoach;
	private Integer seatPerCoach;
	private String source;
	private String destination;
	private String price;
	private Date schedule;
	private Time departureTime;
	private Time arrivalTime;
	
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
	public Date getSchedule() {
		return schedule;
	}
	public void setSchedule(Date schedule) {
		this.schedule = schedule;
	}
	public Time getDepartureTime() {
		return departureTime;
	}
	public void setDepartureTime(Time departureTime) {
		this.departureTime = departureTime;
	}
	public Time getArrivalTime() {
		return arrivalTime;
	}
	public void setArrivalTime(Time arrivalTime) {
		this.arrivalTime = arrivalTime;
	}
	
	

}
