package com.omnis.saas.academico.domain.ports.in;
import com.omnis.saas.academico.domain.model.Curso;
import java.util.List;

public interface CursoUseCase {
    Curso registrar(Curso curso);
    List<Curso> listar();
    Curso buscarPorId(Long id);
    Curso actualizar(Long id, Curso curso);
    void eliminar(Long id);
}