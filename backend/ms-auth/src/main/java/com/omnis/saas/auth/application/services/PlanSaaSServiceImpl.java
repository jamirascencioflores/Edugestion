package com.omnis.saas.auth.application.services;

import com.omnis.saas.auth.domain.ports.in.PlanSaaSUseCase;
import com.omnis.saas.auth.domain.ports.out.ColegioRepositoryPort;
import com.omnis.saas.auth.domain.model.Colegio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlanSaaSServiceImpl implements PlanSaaSUseCase {

    private final ColegioRepositoryPort colegioRepository;

    @Override
    public Integer obtenerLimiteAlumnos(Long colegioId) {
        Colegio colegio = colegioRepository.findById(colegioId)
                .orElseThrow(() -> new RuntimeException("Colegio no encontrado"));

        // Retorna el límite (ej: 300 para Básico, o null/999999 para Premium ilimitado)
        return colegio.getPlan().getLimiteAlumnos();
    }
}