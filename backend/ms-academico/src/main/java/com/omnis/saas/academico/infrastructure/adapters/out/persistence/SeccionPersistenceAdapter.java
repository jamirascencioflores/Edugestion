package com.omnis.saas.academico.infrastructure.adapters.out.persistence;

import com.omnis.saas.academico.domain.model.Seccion;
import com.omnis.saas.academico.domain.ports.out.SeccionRepositoryPort;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper.SeccionMapper;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.SeccionJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class SeccionPersistenceAdapter implements SeccionRepositoryPort {

    private final SeccionJpaRepository repository;
    private final SeccionMapper mapper;

    @Override
    public Optional<Seccion> findById(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Seccion save(Seccion seccion) {
        return mapper.toDomain(repository.save(mapper.toEntity(seccion)));
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<Seccion> findAll() {
        return repository.findAllByOrderByGrado_IdAscNombreAsc().stream()
                .map(mapper::toDomain).toList();
    }
}