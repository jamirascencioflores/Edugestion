package com.omnis.saas.finanzas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsFinanzasApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsFinanzasApplication.class, args);
	}

}
