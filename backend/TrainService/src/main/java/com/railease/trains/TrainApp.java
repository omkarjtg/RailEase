package com.railease.trains;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class TrainApp {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.directory("/home/omkar/RailEase/backend/TrainService")
				.ignoreIfMissing() // Do not throw an exception if .env is missing
				.load();
		dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
		SpringApplication.run(TrainApp.class, args);
	}
}
