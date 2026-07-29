package com.omnis.saas.auth.domain.ports.out;

import com.omnis.saas.auth.domain.model.AnuncioGlobal;
import java.util.List;
import java.util.Optional;

public interface AnuncioGlobalRepositoryPort {
    List<AnuncioGlobal> findAll();
    List<AnuncioGlobal> findByActivoTrue();
    Optional<AnuncioGlobal> findById(Long id);
    AnuncioGlobal save(AnuncioGlobal anuncio);
    void deleteById(Long id);
}