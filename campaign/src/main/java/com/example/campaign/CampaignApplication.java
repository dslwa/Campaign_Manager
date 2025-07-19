package com.example.campaign;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.SpringApplication;

@OpenAPIDefinition(
		info = @Info(
				title       = "Campaign API",
				version     = "1.0.0",
				description = "Zarządzanie kampaniami"
		)
)
@SpringBootApplication
public class CampaignApplication {
	public static void main(String[] args) {
		SpringApplication.run(CampaignApplication.class, args);
	}
}
