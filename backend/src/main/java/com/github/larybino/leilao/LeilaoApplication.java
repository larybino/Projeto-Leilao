package com.github.larybino.leilao;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@EnableAsync
@EnableMethodSecurity
@SpringBootApplication
@EnableScheduling
public class LeilaoApplication {

	public static void main(String[] args) {
		SpringApplication.run(LeilaoApplication.class, args);
	}

}
