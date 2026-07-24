package com.omnis.saas.auth.application.services;

import com.omnis.saas.auth.domain.ports.in.SuperAdminUseCase;
import com.omnis.saas.auth.domain.ports.out.ColegioRepositoryPort;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.DashboardKpisDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SuperAdminUseCaseImpl implements SuperAdminUseCase {

    private final ColegioRepositoryPort colegioRepository;

    @Override
    public DashboardKpisDTO obtenerMetricasDashboard() {
        long total = colegioRepository.count();
        long activos = colegioRepository.countByEstado(true);
        long inactivos = colegioRepository.countByEstado(false);

        long basicos = colegioRepository.countByPlan("BÁSICO");
        long premium = colegioRepository.countByPlan("PREMIUM");

        // Asignación de precios estimados
        double ingresosEstimados = (basicos * 199.0) + (premium * 299.0);

        return new DashboardKpisDTO(total, activos, inactivos, ingresosEstimados);
    }
}