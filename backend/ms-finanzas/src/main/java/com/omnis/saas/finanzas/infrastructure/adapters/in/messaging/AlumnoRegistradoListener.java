package com.omnis.saas.finanzas.infrastructure.adapters.in.messaging;

import com.omnis.saas.finanzas.domain.ports.in.DeudaUseCase;
import com.omnis.saas.finanzas.infrastructure.adapters.in.messaging.dto.AlumnoRegistradoEvent;
import com.omnis.saas.finanzas.infrastructure.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class AlumnoRegistradoListener {

    private final DeudaUseCase deudaUseCase;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_FINANZAS_ALUMNO)
    public void handleAlumnoRegistrado(AlumnoRegistradoEvent event) {
        log.info("Evento recibido: Alumno registrado {} en colegio {}", event.estudianteId(), event.colegioId());

        try {
            deudaUseCase.generarCuotasAnuales(
                    event.colegioId(),
                    event.estudianteId(),
                    event.gradoId(),
                    event.anioEscolar(),
                    event.fechaInscripcion() // <-- Añadido el parámetro de fecha de inscripción
            );
            log.info("Cuotas generadas exitosamente para el estudiante {}", event.estudianteId());
        } catch (Exception e) {
            log.error("Error al generar cuotas para el estudiante {}: {}", event.estudianteId(), e.getMessage());
            // Aquí en el futuro se puede manejar una Dead Letter Queue (DLQ)
        }
    }
}