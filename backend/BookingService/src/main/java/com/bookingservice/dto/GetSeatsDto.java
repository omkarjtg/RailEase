package com.bookingservice.dto;

public class GetSeatsDto {
	
	String number;
	String date;
	
	public GetSeatsDto() {}
	public GetSeatsDto(String number, String date) {
		super();
		this.number = number;
		this.date = date;
	}
	public String getNumber() {
		return number;
	}
	public void setNumber(String number) {
		this.number = number;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	
	

}
