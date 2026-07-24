package com.omnis.saas.academico.infrastructure.adapters.out.messaging;

import com.omnis.saas.academico.domain.model.Estudiante;
import com.omnis.saas.academico.domain.ports.out.EstudianteEventPublisherPort;
import com.omnis.saas.academico.infrastructure.adapters.out.messaging.dto.AlumnoReactivadoEvent;
import com.omnis.saas.academico.infrastructure.adapters.out.messaging.dto.AlumnoRegistradoEvent;
import com.omnis.saas.academico.infrastructure.adapters.out.messaging.dto.AlumnoRetiradoEvent;
import com.omnis.saas.academico.infrastructure.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class EstudianteEventPublisherAdapter implements EstudianteEventPublisherPort {

    private final RabbitTemplate rabbitTemplate;

    private static final String ROUTING_KEY_ALUMNO_REGISTRADO = "alumno.registrado.key";
    private static final String ROUTING_KEY_ALUMNO_RETIRADO = "alumno.retirado.key";

    @Override
    public void publicarAlumnoRegistrado(Estudiante estudiante, Long gradoId, Integer anioEscolar, LocalDate fechaInscripcion) { // <-- Parámetro añadido
        AlumnoRegistradoEvent event = new AlumnoRegistradoEvent(
                estudiante.getColegioId(),
                estudiante.getId(),
                gradoId,
                anioEscolar,
                fechaInscripcion // <-- Campo inyectado al evento
        );

        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_ACADEMICO, ROUTING_KEY_ALUMNO_REGISTRADO, event);
        log.info("Evento publicado: AlumnoRegistrado para estudiante {} en colegio {}", estudiante.getId(), estudiante.getColegioId());
    }

    @Override
    public void publicarAlumnoRetirado(Long colegioId, Long estudianteId) {
        AlumnoRetiradoEvent event = new AlumnoRetiradoEvent(colegioId, estudianteId);

        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_ACADEMICO, ROUTING_KEY_ALUMNO_RETIRADO, event);
        log.info("Evento publicado: AlumnoRetirado para estudiante {} en colegio {}", estudianteId, colegioId);
    }
    private static final String ROUTING_KEY_ALUMNO_REACTIVADO = "alumno.reactivado.key";

    @Override
    public void publicarAlumnoReactivado(Long colegioId, Long estudianteId) {
        AlumnoReactivadoEvent event = new AlumnoReactivadoEvent(colegioId, estudianteId);
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_ACADEMICO, ROUTING_KEY_ALUMNO_REACTIVADO, event);
        log.info("Evento publicado: AlumnoReactivado para estudiante {}", estudianteId);
    }
}