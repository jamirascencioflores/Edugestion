package com.omnis.saas.auth.application.services;

import com.omnis.saas.auth.domain.ports.in.SuperAdminUseCase;
import com.omnis.saas.auth.domain.ports.out.ColegioRepositoryPort;
import com.omnis.saas.auth.domain.ports.out.SuscripcionColegioRepositoryPort;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.DashboardKpisDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class SuperAdminUseCaseImpl implements SuperAdminUseCase {

    private final ColegioRepositoryPort colegioRepository;
    private final SuscripcionColegioRepositoryPort suscripcionRepository; // Inyectamos el repo de suscripciones

    @Override
    public DashboardKpisDTO obtenerMetricasDashboard() {
        long total = colegioRepository.count();
        long activos = colegioRepository.countByEstado(true);
        long inactivos = colegioRepository.countByEstado(false);

        // 🟢 CÁLCULO DINÁMICO DEL MRR: Sumamos el monto total de cada suscripción activa
        double ingresosEstimados = suscripcionRepository.findAll().stream()
                .map(sub -> sub.getMontoTotalMensual())
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue(); // Lo convertimos a double si tu DTO usa double

        return new DashboardKpisDTO(total, activos, inactivos, ingresosEstimados);
    }
}