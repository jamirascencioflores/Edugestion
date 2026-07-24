package com.omnis.saas.auth.domain.ports.out;

import com.omnis.saas.auth.domain.model.PlanSaas;
import java.util.List;
import java.util.Optional;

public interface PlanSaasRepositoryPort {
    Optional<PlanSaas> findByNombre(String nombre);

    List<PlanSaas> findAll();
    Optional<PlanSaas> findById(Long id);
    PlanSaas save(PlanSaas plan);
}