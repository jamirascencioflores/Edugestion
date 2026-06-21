package com.omnis.saas.academico.domain.ports.out;

import com.omnis.saas.academico.domain.model.Estudiante;

public interface EstudianteEventPublisherPort {
    void publicarAlumnoRegistrado(Estudiante estudiante, Long gradoId, Integer anioEscolar);
    void publicarAlumnoRetirado(Long colegioId, Long estudianteId);
    void publicarAlumnoReactivado(Long colegioId, Long estudianteId);
}