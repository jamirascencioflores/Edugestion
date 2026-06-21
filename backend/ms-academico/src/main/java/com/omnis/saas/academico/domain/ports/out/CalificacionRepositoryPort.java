package com.omnis.saas.academico.domain.ports.out;

import com.omnis.saas.academico.domain.model.Calificacion;
import java.util.List;

public interface CalificacionRepositoryPort {
    Calificacion guardar(Calificacion calificacion);
    List<Calificacion> buscarPorCursoYPeriodo(Long colegioId, Long cursoId, String periodo);
    List<Calificacion> buscarPorEstudianteYPeriodo(Long colegioId, Long estudianteId, String periodo);
    List<Calificacion> buscarPorCurso(Long colegioId, Long cursoId);
}