package com.omnis.saas.finanzas.domain.ports.in;

import com.omnis.saas.finanzas.domain.model.Tarifario;
import java.util.List;

public interface TarifarioUseCase {
    Tarifario crearTarifario(Tarifario tarifario);
    List<Tarifario> obtenerPorAnio(Long colegioId, Integer anioEscolar);
    Tarifario actualizarTarifario(Long id, Long colegioId, Tarifario tarifario);
    void cambiarEstado(Long id, Long colegioId, Boolean estado);
    void eliminarTarifario(Long id, Long colegioId);
}