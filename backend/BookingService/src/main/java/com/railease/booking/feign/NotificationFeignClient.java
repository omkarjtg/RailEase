package com.railease.booking.feign;

import com.railease.booking.dto.NotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "notificationservice")
public interface NotificationFeignClient {

    @PostMapping("/api/notify")
    void sendNotification(NotificationRequest request);
}