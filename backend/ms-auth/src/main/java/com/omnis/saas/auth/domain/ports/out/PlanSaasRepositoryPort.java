package com.omnis.saas.auth.domain.ports.out;

import com.omnis.saas.auth.domain.model.PlanSaas;
import java.util.Optional;

public interface PlanSaasRepositoryPort {
    Optional<PlanSaas> findByNombre(String nombre);
}