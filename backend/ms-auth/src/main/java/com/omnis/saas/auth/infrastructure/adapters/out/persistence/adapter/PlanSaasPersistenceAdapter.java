package com.omnis.saas.auth.infrastructure.adapters.out.persistence.adapter;

import com.omnis.saas.auth.domain.model.PlanSaas;
import com.omnis.saas.auth.domain.ports.out.PlanSaasRepositoryPort;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.PlanSaasJpaRepository;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.mapper.PlanSaasMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PlanSaasPersistenceAdapter implements PlanSaasRepositoryPort {

    private final PlanSaasJpaRepository planSaasRepository;
    private final PlanSaasMapper planSaasMapper;

    @Override
    public Optional<PlanSaas> findByNombre(String nombre) {
        return planSaasRepository.findByNombre(nombre).map(planSaasMapper::toDomain);
    }
}