package com.omnis.saas.finanzas.infrastructure.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_ACADEMICO = "academico.exchange";

    // Evento: Alumno Registrado
    public static final String QUEUE_FINANZAS_ALUMNO = "finanzas.alumno.registrado.queue";
    public static final String ROUTING_KEY_ALUMNO_REGISTRADO = "alumno.registrado.key";

    // Evento: Alumno Retirado (NUEVO)
    public static final String QUEUE_ALUMNO_RETIRADO = "finanzas.alumno.retirado.queue";
    public static final String ROUTING_KEY_ALUMNO_RETIRADO = "alumno.retirado.key";

    // Evento: Alumno Reactivado (NUEVO)
    public static final String QUEUE_ALUMNO_REACTIVADO = "finanzas.alumno.reactivado.queue";
    public static final String ROUTING_KEY_ALUMNO_REACTIVADO = "alumno.reactivado.key";

    @Bean
    public DirectExchange exchangeAcademico() {
        return new DirectExchange(EXCHANGE_ACADEMICO);
    }

    // --- Beans para Alumno Registrado ---
    @Bean
    public Queue queueFinanzasAlumno() {
        return new Queue(QUEUE_FINANZAS_ALUMNO, true);
    }

    @Bean
    public Binding bindingFinanzasAlumno(Queue queueFinanzasAlumno, DirectExchange exchangeAcademico) {
        return BindingBuilder.bind(queueFinanzasAlumno).to(exchangeAcademico).with(ROUTING_KEY_ALUMNO_REGISTRADO);
    }

    // --- Beans para Alumno Retirado ---
    @Bean
    public Queue queueAlumnoRetirado() {
        return new Queue(QUEUE_ALUMNO_RETIRADO, true);
    }

    @Bean
    public Binding bindingAlumnoRetirado(Queue queueAlumnoRetirado, DirectExchange exchangeAcademico) {
        return BindingBuilder.bind(queueAlumnoRetirado).to(exchangeAcademico).with(ROUTING_KEY_ALUMNO_RETIRADO);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new JacksonJsonMessageConverter();
    }

    // --- Beans para Alumno Reactivado ---
    @Bean
    public Queue queueAlumnoReactivado() {
        return new Queue(QUEUE_ALUMNO_REACTIVADO, true);
    }

    @Bean
    public Binding bindingAlumnoReactivado(Queue queueAlumnoReactivado, DirectExchange exchangeAcademico) {
        return BindingBuilder.bind(queueAlumnoReactivado).to(exchangeAcademico).with(ROUTING_KEY_ALUMNO_REACTIVADO);
    }
}