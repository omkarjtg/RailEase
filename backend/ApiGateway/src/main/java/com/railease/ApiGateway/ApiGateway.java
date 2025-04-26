package com.railease.ApiGateway;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGateway {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.directory("/home/omkar/RailEase/backend/ApiGateway")
				.ignoreIfMissing()
				.load();
		dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
		SpringApplication.run(ApiGateway.class, args);
	}

}
		