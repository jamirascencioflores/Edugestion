package com.omnis.saas.academico.domain.ports.out;

import com.omnis.saas.academico.domain.model.Periodo;
import java.util.List;
import java.util.Optional;

public interface PeriodoRepositoryPort {
    Periodo guardar(Periodo periodo);
    List<Periodo> buscarTodos();

    Optional<Periodo> buscarPorId(Long id);
    void eliminarPorId(Long id);
}