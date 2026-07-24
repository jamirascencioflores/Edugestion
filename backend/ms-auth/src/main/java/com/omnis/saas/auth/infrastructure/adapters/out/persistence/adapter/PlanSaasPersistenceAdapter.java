package com.omnis.saas.auth.infrastructure.adapters.out.persistence.adapter;

import com.omnis.saas.auth.domain.model.PlanSaas;
import com.omnis.saas.auth.domain.ports.out.PlanSaasRepositoryPort;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.PlanSaasJpaRepository;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.mapper.PlanSaasMapper;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.PlanSaasEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PlanSaasPersistenceAdapter implements PlanSaasRepositoryPort {

    private final PlanSaasJpaRepository planSaasRepository;
    private final PlanSaasMapper planSaasMapper;

    @Override
    public Optional<PlanSaas> findByNombre(String nombre) {
        return planSaasRepository.findByNombre(nombre).map(planSaasMapper::toDomain);
    }

    @Override
    public List<PlanSaas> findAll() {
        return planSaasRepository.findAll().stream()
                .map(planSaasMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<PlanSaas> findById(Long id) {
        return planSaasRepository.findById(id).map(planSaasMapper::toDomain);
    }

    @Override
    public PlanSaas save(PlanSaas plan) {
        PlanSaasEntity entity = planSaasMapper.toEntity(plan);
        PlanSaasEntity savedEntity = planSaasRepository.save(entity);
        return planSaasMapper.toDomain(savedEntity);
    }
}