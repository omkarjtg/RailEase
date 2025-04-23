package com.railease.users.dto;

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
    private String type; // BOOKING_CONFIRMATION or BOOKING_CANCELLATION or PASSWORD_RESET
    private Map<String, Object> data;
}


