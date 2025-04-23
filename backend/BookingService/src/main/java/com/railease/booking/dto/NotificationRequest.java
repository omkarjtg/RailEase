package com.railease.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
        private String to;
        private String type; // BOOKING_CONFIRMATION or BOOKING_CANCELLATION
        private Map<String, Object> data;
}
//{
//        "to": "omkarjtg@outlook.com",
//        "type": "BOOKING_CANCELLATION",
//        "data": {
//        "userName": "Omkar",
//        "trainName": "Rajdhani Express",
//        "source": "Mumbai",
//        "destination": "Delhi",
//        "schedule": "2025-04-22",
//        "departureTime": "08:00",
//        "bookingId": 1337
//        }
//        }
