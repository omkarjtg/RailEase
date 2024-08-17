package com.trainbooking.locationservice.locationmicroservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication (exclude={ SecurityAutoConfiguration.class })
public class LocationMicroserviceApplication {

    public static void main(String[] args) {
        SpringApplication.run(LocationMicroserviceApplication.class, args);
    }

}
