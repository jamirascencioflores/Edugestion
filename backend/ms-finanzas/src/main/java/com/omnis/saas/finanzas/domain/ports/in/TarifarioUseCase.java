package com.omnis.saas.finanzas.domain.ports.in;

import com.omnis.saas.finanzas.domain.model.Tarifario;
import java.util.List;

public interface TarifarioUseCase {
    Tarifario crearTarifario(Tarifario tarifario);
    List<Tarifario> obtenerPorAnio(Long colegioId, Integer anioEscolar);
}