package com.omnis.saas.auth.infrastructure.adapters.out.persistence.adapter;

import com.omnis.saas.auth.domain.model.SuscripcionColegio;
import com.omnis.saas.auth.domain.ports.out.SuscripcionColegioRepositoryPort;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.SuscripcionColegioEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.mapper.SuscripcionColegioMapper;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.SuscripcionColegioJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SuscripcionColegioPersistenceAdapter implements SuscripcionColegioRepositoryPort {

    private final SuscripcionColegioJpaRepository jpaRepository;
    private final SuscripcionColegioMapper mapper;

    @Override
    public List<SuscripcionColegio> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<SuscripcionColegio> findByColegioId(Long colegioId) {
        return jpaRepository.findByColegioId(colegioId).map(mapper::toDomain);
    }

    @Override
    public SuscripcionColegio save(SuscripcionColegio suscripcion) {
        SuscripcionColegioEntity entity = mapper.toEntity(suscripcion);
        return mapper.toDomain(jpaRepository.save(entity));
    }
}