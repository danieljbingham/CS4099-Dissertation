package com.ideatogrant.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;

@SpringBootApplication
@EnableResourceServer
public class BackendApplication {

	// entry point for program
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
}
