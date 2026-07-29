package com.omnis.saas.auth.infrastructure.adapters.out.persistence.adapter;

import com.omnis.saas.auth.domain.model.AnuncioGlobal;
import com.omnis.saas.auth.domain.ports.out.AnuncioGlobalRepositoryPort;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.mapper.AnuncioGlobalMapper;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.SpringDataAnuncioGlobalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AnuncioGlobalPersistenceAdapter implements AnuncioGlobalRepositoryPort {

    private final SpringDataAnuncioGlobalRepository repository;
    private final AnuncioGlobalMapper mapper;

    @Override
    public List<AnuncioGlobal> findAll() {
        return repository.findAll().stream().map(mapper::toDomain).toList();
    }

    @Override
    public List<AnuncioGlobal> findByActivoTrue() {
        return repository.findByActivoTrue().stream().map(mapper::toDomain).toList();
    }

    @Override
    public Optional<AnuncioGlobal> findById(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public AnuncioGlobal save(AnuncioGlobal anuncio) {
        var entity = mapper.toEntity(anuncio);
        var saved = repository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}