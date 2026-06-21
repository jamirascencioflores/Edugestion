package com.omnis.saas.academico.application.services;

import com.omnis.saas.academico.domain.model.Periodo;
import com.omnis.saas.academico.domain.ports.in.PeriodoUseCase;
import com.omnis.saas.academico.domain.ports.out.PeriodoRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PeriodoServiceImpl implements PeriodoUseCase {

    private final PeriodoRepositoryPort repositoryPort;

    @Override
    public Periodo registrarPeriodo(Periodo periodo) {
        // Regla de negocio: La fecha de inicio no puede ser mayor a la de fin
        if (periodo.getFechaInicio().isAfter(periodo.getFechaFin())) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser posterior a la fecha de fin.");
        }

        return repositoryPort.guardar(periodo);
    }
    @Transactional(readOnly = true) // <-- ESTO ES VITAL PARA QUE EL AOP NO SE PIERDA
    @Override public List<Periodo> listar() { return repositoryPort.buscarTodos(); }

    @Transactional
    @Override
    public Periodo actualizar(Long id, Periodo periodoActualizado) {
        // 1. Buscamos el existente (El filtro AOP garantiza que solo encuentre los de su colegio)
        Periodo existente = repositoryPort.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Periodo no encontrado"));

        // 2. Actualizamos los datos
        existente.setNombre(periodoActualizado.getNombre());
        existente.setFechaInicio(periodoActualizado.getFechaInicio());
        existente.setFechaFin(periodoActualizado.getFechaFin());
        existente.setEstado(periodoActualizado.getEstado());

        // 3. Guardamos
        return repositoryPort.guardar(existente);
    }

    @Transactional
    @Override
    public void eliminar(Long id) {
        repositoryPort.eliminarPorId(id);
    }
}