package com.omnis.saas.academico.domain.ports.in;

import com.omnis.saas.academico.domain.model.Periodo;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.GenerarPeriodosDTO;

import java.util.List;

public interface PeriodoUseCase {
    Periodo registrarPeriodo(Periodo periodo);
    List<Periodo> listar();
    Periodo actualizar(Long id, Periodo periodo);
    void eliminar(Long id);
    List<Periodo> generarPeriodosAutomaticos(Long colegioId, GenerarPeriodosDTO dto);
    Periodo cambiarEstado(Long colegioId, Long periodoId, String nuevoEstado);
}