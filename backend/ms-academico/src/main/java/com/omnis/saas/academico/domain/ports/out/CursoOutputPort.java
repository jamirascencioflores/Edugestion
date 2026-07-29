package com.omnis.saas.academico.domain.ports.out;

import com.omnis.saas.academico.domain.model.Curso;
import java.util.Optional;

public interface CursoOutputPort {
    Curso guardar(Curso curso);
    Optional<Curso> buscarCursoPorNombreYColegio(String nombre, Long colegioId);
}