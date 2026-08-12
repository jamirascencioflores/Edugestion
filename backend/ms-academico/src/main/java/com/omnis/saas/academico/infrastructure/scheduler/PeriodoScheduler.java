// src/main/java/com/omnis/saas/academico/infrastructure/scheduler/PeriodoScheduler.java
package com.omnis.saas.academico.infrastructure.scheduler;

import com.omnis.saas.academico.domain.ports.out.PeriodoRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class PeriodoScheduler {

    private final PeriodoRepositoryPort periodoRepositoryPort; // 👈 Inyecta el Puerto de Salida

    // Se ejecuta todos los días a las 00:00:00 (Medianoche)
    @Scheduled(cron = "0 0 0 * * *")
    public void actualizarEstadosPeriodosAutomatico() {
        LocalDate hoy = LocalDate.now();

        // 1. Cerrar automáticamente los periodos cuyo fechaFin ya pasó
        periodoRepositoryPort.cerrarPeriodosVencidos(hoy);

        // 2. Activar automáticamente el periodo que inicia hoy (o ya inició y sigue pendiente)
        periodoRepositoryPort.activarPeriodoActual(hoy);
    }
}