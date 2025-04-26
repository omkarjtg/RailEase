package com.railease.users;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class UserApp {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure()
                .directory("/home/omkar/RailEase/backend/UserService")
                .ignoreIfMissing() // Do not throw an exception if .env is missing
                .load();
        dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
        SpringApplication.run(UserApp.class, args);
    }

}
