package com.omnis.saas.finanzas.domain.ports.out;

import com.omnis.saas.finanzas.domain.model.Tarifario;
import java.util.List;
import java.util.Optional;

public interface TarifarioRepositoryPort {
    Tarifario save(Tarifario tarifario);
    Optional<Tarifario> findByIdAndColegioId(Long id, Long colegioId);
    List<Tarifario> findByColegioIdAndAnioEscolar(Long colegioId, Integer anioEscolar);
}