package com.omnis.saas.finanzas.infrastructure.adapters.out.persistence;

import com.omnis.saas.finanzas.domain.model.Tarifario;
import com.omnis.saas.finanzas.domain.ports.out.TarifarioRepositoryPort;
import com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.mapper.TarifarioMapper;
import com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.repository.TarifarioJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class TarifarioPersistenceAdapter implements TarifarioRepositoryPort {

    private final TarifarioJpaRepository repository;
    private final TarifarioMapper mapper;

    @Override
    public Tarifario save(Tarifario tarifario) {
        return mapper.toDomain(repository.save(mapper.toEntity(tarifario)));
    }

    @Override
    public Optional<Tarifario> findByIdAndColegioId(Long id, Long colegioId) {
        return repository.findByIdAndColegioId(id, colegioId).map(mapper::toDomain);
    }

    @Override
    public List<Tarifario> findByColegioIdAndAnioEscolar(Long colegioId, Integer anioEscolar) {
        return repository.findByColegioIdAndAnioEscolar(colegioId, anioEscolar)
                .stream().map(mapper::toDomain).toList();
    }

    @Override
    public void deleteByIdAndColegioId(Long id, Long colegioId) {
        repository.deleteByIdAndColegioId(id, colegioId);
    }
}