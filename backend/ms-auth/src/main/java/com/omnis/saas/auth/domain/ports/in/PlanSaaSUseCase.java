package com.omnis.saas.auth.domain.ports.in;

import com.omnis.saas.auth.domain.model.PlanSaas;
import java.util.List;

public interface PlanSaaSUseCase {
    Integer obtenerLimiteAlumnos(Long colegioId);

    // --- NUEVOS MÉTODOS ---
    List<PlanSaas> obtenerTodosLosPlanes();
    PlanSaas actualizarPlan(Long id, PlanSaas planActualizado);
}