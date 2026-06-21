package com.omnis.saas.finanzas.infrastructure.adapters.in.rabbitmq;

import com.omnis.saas.finanzas.domain.ports.in.DeudaUseCase;
import com.omnis.saas.finanzas.infrastructure.adapters.in.messaging.dto.AlumnoReactivadoEvent;
import com.omnis.saas.finanzas.infrastructure.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AlumnoReactivadoListener {

    private final DeudaUseCase deudaUseCase;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_ALUMNO_REACTIVADO)
    public void handleAlumnoReactivado(AlumnoReactivadoEvent event) {
        deudaUseCase.reactivarCuotasAnuladas(event.colegioId(), event.estudianteId());
    }
}