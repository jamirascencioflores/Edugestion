package com.omnis.saas.auth.infrastructure.adapters.out.persistence.adapter;

import com.omnis.saas.auth.domain.model.Docente;
import com.omnis.saas.auth.domain.ports.out.DocenteRepositoryPort;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.DocenteJpaRepository;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.DocenteEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.mapper.DocenteMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DocentePersistenceAdapter implements DocenteRepositoryPort {

    private final DocenteJpaRepository docenteRepository;
    private final DocenteMapper docenteMapper;
    private final DocenteJpaRepository repository;

    @Override
    public Docente save(Docente docente) {
        DocenteEntity entity = docenteMapper.toEntity(docente);
        DocenteEntity savedEntity = docenteRepository.save(entity);
        return docenteMapper.toDomain(savedEntity);
    }

    @Override
    public List<Docente> findByColegioId(Long colegioId) {
        return docenteRepository.findByColegioId(colegioId).stream()
                .map(docenteMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteByColegioId(Long colegioId) {
        repository.deleteByColegioId(colegioId);
    }

    @Override
    public Optional<Docente> findById(Long id) {
        return docenteRepository.findById(id).map(docenteMapper::toDomain);
    }

    @Override
    public void deleteById(Long id) {
        docenteRepository.deleteById(id);
    }
}