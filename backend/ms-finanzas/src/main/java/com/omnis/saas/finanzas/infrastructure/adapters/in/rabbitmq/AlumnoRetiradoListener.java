package com.omnis.saas.finanzas.infrastructure.adapters.in.rabbitmq;

import com.omnis.saas.finanzas.domain.ports.in.DeudaUseCase;
import com.omnis.saas.finanzas.infrastructure.adapters.in.messaging.dto.AlumnoRetiradoEvent;
import com.omnis.saas.finanzas.infrastructure.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AlumnoRetiradoListener {

    private final DeudaUseCase deudaUseCase;

    // 👇 Se usa la constante de tu configuración
    @RabbitListener(queues = RabbitMQConfig.QUEUE_ALUMNO_RETIRADO)
    public void handleAlumnoRetirado(AlumnoRetiradoEvent event) {
        deudaUseCase.anularCuotasPendientes(event.colegioId(), event.estudianteId());
    }
}