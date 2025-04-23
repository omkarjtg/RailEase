package com.railease.feedback;

import org.springframework.boot.SpringApplication;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class FeedbackApp {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().load();
		dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
		SpringApplication.run(FeedbackApp.class, args);
	}

}
