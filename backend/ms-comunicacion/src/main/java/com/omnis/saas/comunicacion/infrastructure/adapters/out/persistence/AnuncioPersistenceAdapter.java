package com.omnis.saas.comunicacion.infrastructure.adapters.out.persistence;

import com.omnis.saas.comunicacion.domain.model.Anuncio;
import com.omnis.saas.comunicacion.domain.ports.out.AnuncioRepositoryPort;
import com.omnis.saas.comunicacion.infrastructure.adapters.out.persistence.mapper.AnuncioMapper;
import com.omnis.saas.comunicacion.infrastructure.adapters.out.persistence.repository.AnuncioJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AnuncioPersistenceAdapter implements AnuncioRepositoryPort {

    private final AnuncioJpaRepository repository;
    private final AnuncioMapper mapper;

    @Override
    public Anuncio guardar(Anuncio anuncio) {
        return mapper.toDomain(repository.save(mapper.toEntity(anuncio)));
    }

    @Override
    public List<Anuncio> listarPorColegio(Long colegioId) {
        return repository.findByColegioIdAndEstadoOrderByFechaPublicacionDesc(colegioId, true)
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Anuncio> buscarPorId(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }
}