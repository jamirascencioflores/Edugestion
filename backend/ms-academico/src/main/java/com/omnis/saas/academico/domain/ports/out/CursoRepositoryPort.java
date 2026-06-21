package com.omnis.saas.academico.domain.ports.out;

import com.omnis.saas.academico.domain.model.Curso;
import java.util.List;

public interface CursoRepositoryPort {
    Curso guardar(Curso curso);
    List<Curso> buscarTodos();
    Curso buscarPorId(Long id);
    void eliminar(Long id);
}