package com.omnis.saas.auth.application.services;

import com.omnis.saas.auth.domain.ports.in.PlanSaaSUseCase;
import com.omnis.saas.auth.domain.ports.out.ColegioRepositoryPort;
import com.omnis.saas.auth.domain.ports.out.PlanSaasRepositoryPort;
import com.omnis.saas.auth.domain.model.Colegio;
import com.omnis.saas.auth.domain.model.PlanSaas;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanSaaSServiceImpl implements PlanSaaSUseCase {

    private final ColegioRepositoryPort colegioRepository;
    private final PlanSaasRepositoryPort planSaasRepository;

    @Override
    public Integer obtenerLimiteAlumnos(Long colegioId) {
        Colegio colegio = colegioRepository.findById(colegioId)
                .orElseThrow(() -> new RuntimeException("Colegio no encontrado"));
        return colegio.getPlan().getLimiteAlumnos();
    }

    @Override
    public List<PlanSaas> obtenerTodosLosPlanes() {
        return planSaasRepository.findAll();
    }

    @Override
    public PlanSaas actualizarPlan(Long id, PlanSaas planActualizado) {
        PlanSaas planExistente = planSaasRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado"));

        planExistente.setPrecioMensual(planActualizado.getPrecioMensual());
        planExistente.setLimiteAlumnos(planActualizado.getLimiteAlumnos());
        planExistente.setPermitePortalPadres(planActualizado.getPermitePortalPadres());
        planExistente.setPermiteNotificaciones(planActualizado.getPermiteNotificaciones());
        planExistente.setPermiteReportesPdf(planActualizado.getPermiteReportesPdf());
        planExistente.setPermiteMarcaBlanca(planActualizado.getPermiteMarcaBlanca());
        planExistente.setPermiteFinanzasPro(planActualizado.getPermiteFinanzasPro());

        return planSaasRepository.save(planExistente);
    }
}