package com.omnis.saas.academico.infrastructure.adapters.in.scheduler;

import com.omnis.saas.academico.domain.ports.out.PeriodoRepositoryPort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class PeriodoCronScheduler {

    private final PeriodoRepositoryPort periodoRepositoryPort;

    public PeriodoCronScheduler(PeriodoRepositoryPort periodoRepositoryPort) {
        this.periodoRepositoryPort = periodoRepositoryPort;
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void ejecutarCierreYAperturaAutomatica() {
        LocalDate hoy = LocalDate.now();

        // 1. Cierra automáticamente los que ya finalizaron
        periodoRepositoryPort.cerrarPeriodosVencidos(hoy);

        // 2. Activa el periodo que inicia hoy (o ya inició y sigue pendiente)
        periodoRepositoryPort.activarPeriodoActual(hoy);
    }
}