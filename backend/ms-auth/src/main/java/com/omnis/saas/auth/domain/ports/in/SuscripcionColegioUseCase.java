package com.omnis.saas.auth.domain.ports.in;

import com.omnis.saas.auth.domain.model.SuscripcionColegio;
import java.util.List;

public interface SuscripcionColegioUseCase {
    List<SuscripcionColegio> obtenerTodasLasSuscripciones();
    SuscripcionColegio obtenerPorColegioId(Long colegioId);
    SuscripcionColegio actualizarSuscripcion(Long colegioId, SuscripcionColegio suscripcionActualizada);
}