package com.omnis.saas.academico.infrastructure.adapters.out.persistence;

import com.omnis.saas.academico.domain.model.Grado;
import com.omnis.saas.academico.domain.ports.out.GradoRepositoryPort;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper.GradoMapper;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.GradoJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class GradoPersistenceAdapter implements GradoRepositoryPort {

    private final GradoJpaRepository repository;
    private final GradoMapper mapper;

    @Override
    public Optional<Grado> findById(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Grado save(Grado grado) {
        return mapper.toDomain(repository.save(mapper.toEntity(grado)));
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<Grado> findAll() {
        // 👇 Se actualizó para usar el orden por el campo numérico "orden"
        return repository.findAllByOrderByOrdenAsc().stream()
                .map(mapper::toDomain).toList();
    }
}