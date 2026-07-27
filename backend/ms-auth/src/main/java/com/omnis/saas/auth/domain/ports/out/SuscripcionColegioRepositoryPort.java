package com.omnis.saas.auth.domain.ports.out;

import com.omnis.saas.auth.domain.model.SuscripcionColegio;
import java.util.List;
import java.util.Optional;

public interface SuscripcionColegioRepositoryPort {
    List<SuscripcionColegio> findAll();
    Optional<SuscripcionColegio> findByColegioId(Long colegioId);
    SuscripcionColegio save(SuscripcionColegio suscripcion);
}