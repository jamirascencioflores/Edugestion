package com.omnis.saas.auth.infrastructure.adapters.out.persistence.adapter;


import com.omnis.saas.auth.domain.model.Docente;
import com.omnis.saas.auth.domain.ports.out.DocenteRepositoryPort;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.DocenteEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.mapper.DocenteMapper;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.DocenteJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DocentePersistenceAdapter implements DocenteRepositoryPort {

    private final DocenteJpaRepository docenteJpaRepository;
    private final DocenteMapper docenteMapper;

    @Override
    public Docente save(Docente docente) {
        DocenteEntity entity = docenteMapper.toEntity(docente);
        return docenteMapper.toDomain(docenteJpaRepository.save(entity));
    }

    @Override
    public List<Docente> findByColegioId(Long colegioId) {
        return docenteJpaRepository.findByColegioId(colegioId).stream()
                .map(docenteMapper::toDomain)
                .toList();
    }

    @Override
    public void deleteByColegioId(Long colegioId) {
        docenteJpaRepository.deleteByColegioId(colegioId);
    }

    @Override
    public Optional<Docente> findById(Long id) {
        return docenteJpaRepository.findById(id)
                .map(docenteMapper::toDomain);
    }

    @Override
    public void deleteById(Long id) {
        docenteJpaRepository.deleteById(id);
    }

    @Override
    public boolean existsByDocumentoIdentidadAndColegioId(String documentoIdentidad, Long colegioId) {
        return docenteJpaRepository.existsByDocumentoIdentidadAndColegioId(documentoIdentidad, colegioId);
    }
}