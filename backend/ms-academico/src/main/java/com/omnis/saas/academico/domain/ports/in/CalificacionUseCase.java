package com.omnis.saas.academico.domain.ports.in;

import com.omnis.saas.academico.domain.model.Calificacion;
import java.util.List;

public interface CalificacionUseCase {
    Calificacion registrar(Calificacion calificacion);
    List<Calificacion> listarPorCurso(Long colegioId, Long cursoId, String periodo);
    List<Calificacion> listarPorEstudiante(Long colegioId, Long estudianteId, String periodo);
    List<Calificacion> listarPorCursoTodosPeriodos(Long colegioId, Long cursoId);
    List<Calificacion> registrarMasivo(List<Calificacion> calificaciones);
}