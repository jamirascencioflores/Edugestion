package com.omnis.saas.academico.domain.ports.out;

import com.omnis.saas.academico.domain.model.Periodo;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PeriodoRepositoryPort {
    Periodo guardar(Periodo periodo);
    List<Periodo> guardarTodos(List<Periodo> periodos);
    List<Periodo> buscarTodos();
    List<Periodo> buscarPorColegioId(Long colegioId);
    Optional<Periodo> buscarPorId(Long id);
    void eliminarPorId(Long id);

    // ⚡ Nuevos métodos para la transición automática
    void cerrarPeriodosVencidos(LocalDate fecha);
    void activarPeriodoActual(LocalDate fecha);
}