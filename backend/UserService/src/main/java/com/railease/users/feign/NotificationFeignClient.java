package com.railease.users.feign;

import com.railease.users.dto.NotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notificationService")
public interface NotificationFeignClient {

    @PostMapping("/api/notify")
    void sendNotification(@RequestBody NotificationRequest request);
}
