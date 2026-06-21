package com.omnis.saas.auth.infrastructure.adapters.in.cron;

import com.omnis.saas.auth.domain.model.Colegio;
import com.omnis.saas.auth.domain.ports.out.ColegioRepositoryPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class SuscripcionCronJob {

    private final ColegioRepositoryPort colegioRepository;

    @Scheduled(cron = "0 0 0 * * ?") // Todos los días a medianoche
    public void verificarSuscripcionesVencidas() {
        log.info("Verificando suscripciones vencidas...");

        LocalDate hoy = LocalDate.now();
        List<Colegio> colegiosVencidos = colegioRepository.buscarColegiosConSuscripcionVencida(hoy);

        if (!colegiosVencidos.isEmpty()) {
            for (Colegio colegio : colegiosVencidos) {
                colegio.setEstado(false); // <--- Lo pasamos a Inactivo (false)
                log.info("Colegio inactivado por falta de pago: {}", colegio.getNombre());
            }
            colegioRepository.guardarTodos(colegiosVencidos);
        }
    }
}