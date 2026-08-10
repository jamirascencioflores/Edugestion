package com.omnis.saas.academico.application.services;

import com.omnis.saas.academico.domain.model.EstadoPeriodo;
import com.omnis.saas.academico.domain.model.Periodo;
import com.omnis.saas.academico.domain.ports.in.PeriodoUseCase;
import com.omnis.saas.academico.domain.ports.out.PeriodoRepositoryPort;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.GenerarPeriodosDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
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

    @Override
    @Transactional
    public List<Periodo> generarPeriodosAutomaticos(Long colegioId, GenerarPeriodosDTO dto) {
        List<Periodo> creados = new ArrayList<>();
        boolean esBimestral = "BIMESTRAL".equalsIgnoreCase(dto.getTipoModalidad());

        int cantidadPeriodos = esBimestral ? 4 : 3;
        int semanasPorPeriodo = esBimestral ? 9 : 12;

        LocalDate inicioCurr = dto.getFechaInicio();

        for (int i = 1; i <= cantidadPeriodos; i++) {
            String nombre = (esBimestral ? "Bimestre " : "Trimestre ") + i + " - " + dto.getAnioEscolar();
            LocalDate finCurr = inicioCurr.plusWeeks(semanasPorPeriodo).minusDays(1);

            Periodo periodo = Periodo.builder()
                    .colegioId(colegioId)
                    .nombre(nombre)
                    .fechaInicio(inicioCurr)
                    .fechaFin(finCurr)
                    .estado(i == 1 ? EstadoPeriodo.ACTIVO : EstadoPeriodo.PENDIENTE) // El primero nace ACTIVO
                    .build();

            creados.add(repositoryPort.guardar(periodo));

            // Avanza 1 semana de vacaciones entre bimestres/trimestres
            inicioCurr = finCurr.plusDays(8);
        }

        return creados;
    }

    @Override
    @Transactional
    public Periodo cambiarEstado(Long colegioId, Long periodoId, String nuevoEstado) {
        List<Periodo> periodos = repositoryPort.buscarPorColegioId(colegioId);
        EstadoPeriodo objetivo = EstadoPeriodo.valueOf(nuevoEstado.toUpperCase());

        Periodo objetivoPeriodo = null;

        for (Periodo p : periodos) {
            if (p.getId().equals(periodoId)) {
                p.setEstado(objetivo);
                objetivoPeriodo = p;
            } else if (objetivo == EstadoPeriodo.ACTIVO && p.getEstado() == EstadoPeriodo.ACTIVO) {
                p.setEstado(EstadoPeriodo.CERRADO);
            }
        }

        repositoryPort.guardarTodos(periodos);
        return objetivoPeriodo;
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Periodo periodo = repositoryPort.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Periodo no encontrado con id: " + id));

        if (periodo.getEstado() == EstadoPeriodo.CERRADO) {
            throw new RuntimeException("No se puede eliminar un periodo CERRADO para proteger el historial académico.");
        }

        repositoryPort.eliminarPorId(id);
    }
}