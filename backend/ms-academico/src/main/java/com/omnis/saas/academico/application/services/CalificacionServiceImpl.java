package com.omnis.saas.academico.application.services;

import com.omnis.saas.academico.domain.model.Calificacion;
import com.omnis.saas.academico.domain.ports.in.CalificacionUseCase;
import com.omnis.saas.academico.domain.ports.out.CalificacionRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CalificacionServiceImpl implements CalificacionUseCase {

    private final CalificacionRepositoryPort repositoryPort;

    @Override
    @Transactional
    public Calificacion registrar(Calificacion calificacion) {
        if (calificacion.getFechaRegistro() == null) {
            calificacion.setFechaRegistro(LocalDate.now());
        }
        return repositoryPort.guardar(calificacion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Calificacion> listarPorCurso(Long colegioId, Long cursoId, String periodo) {
        return repositoryPort.buscarPorCursoYPeriodo(colegioId, cursoId, periodo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Calificacion> listarPorEstudiante(Long colegioId, Long estudianteId, String periodo) {
        return repositoryPort.buscarPorEstudianteYPeriodo(colegioId, estudianteId, periodo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Calificacion> listarPorCursoTodosPeriodos(Long colegioId, Long cursoId) {
        return repositoryPort.buscarPorCurso(colegioId, cursoId);
    }

    @Override
    @Transactional
    public List<Calificacion> registrarMasivo(List<Calificacion> calificaciones) {
        return calificaciones.stream().map(notaEntrante -> {
            // Ahora buscamos con los 4 parámetros exactos
            repositoryPort.buscarUnica(
                    notaEntrante.getColegioId(),
                    notaEntrante.getEstudianteId(),
                    notaEntrante.getCursoId(),
                    notaEntrante.getPeriodo()
            ).ifPresent(notaExistente -> {
                // Le pasamos el ID a la nota nueva para que JPA haga UPDATE
                notaEntrante.setId(notaExistente.getId());
                notaEntrante.setFechaRegistro(notaExistente.getFechaRegistro());
            });

            return registrar(notaEntrante);
        }).toList();
    }
}