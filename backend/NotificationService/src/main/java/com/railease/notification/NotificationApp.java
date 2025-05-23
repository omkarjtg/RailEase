package com.railease.notification;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class NotificationApp {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.directory("/home/omkar/RailEase/backend/NotificationService")
				.ignoreIfMissing() // Do not throw an exception if .env is missing
				.load();
		dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
		SpringApplication.run(NotificationApp.class, args);
	}

}
