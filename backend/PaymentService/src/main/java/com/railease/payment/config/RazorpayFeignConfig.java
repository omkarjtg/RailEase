package com.railease.payment.config;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Base64;

@Configuration
public class RazorpayFeignConfig {

    @Value("${razorpay.key}")
    private String razorpayKey;

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    @Bean
    public RequestInterceptor basicAuthRequestInterceptor() {
        return requestTemplate -> {
            String auth = razorpayKey + ":" + razorpaySecret;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            requestTemplate.header("Authorization", "Basic " + encodedAuth);
        };
    }
}