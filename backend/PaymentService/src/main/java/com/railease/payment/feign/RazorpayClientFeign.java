package com.railease.payment.feign;

import com.railease.payment.config.RazorpayFeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "razorpay-api", url = "https://api.razorpay.com/v1", configuration = RazorpayFeignConfig.class)
public interface RazorpayClientFeign {

    @GetMapping("/orders/{orderId}")
    ResponseEntity<Object> getOrder(@PathVariable("orderId") String orderId);
}