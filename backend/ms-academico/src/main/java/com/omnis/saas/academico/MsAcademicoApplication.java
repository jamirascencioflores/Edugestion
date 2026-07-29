package com.omnis.saas.academico;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients; // 👈 Asegúrate de importar esto

@SpringBootApplication
@EnableFeignClients(basePackages = "com.omnis.saas.academico.infrastructure.adapters.out.feign") // 👈 Agrega esta anotación
public class MsAcademicoApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsAcademicoApplication.class, args);
	}
}