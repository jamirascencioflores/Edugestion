package com.omnis.saas.academico.domain.ports.in;

import com.omnis.saas.academico.domain.model.Periodo;
import java.util.List;

public interface PeriodoUseCase {
    Periodo registrarPeriodo(Periodo periodo);
    List<Periodo> listar();

    Periodo actualizar(Long id, Periodo periodo);
    void eliminar(Long id);
}