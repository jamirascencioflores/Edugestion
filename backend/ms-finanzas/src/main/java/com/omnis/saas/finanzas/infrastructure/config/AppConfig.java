package com.omnis.saas.finanzas.infrastructure.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Bean
    @LoadBalanced // Permite resolver "http://ms-academico/..." vía Eureka
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}