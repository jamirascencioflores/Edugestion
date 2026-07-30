package com.omnis.saas.academico.infrastructure.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Bean
    @LoadBalanced // 👈 Indispensable si usas Eureka/Spring Cloud para resolver "http://ms-finanzas/..."
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}