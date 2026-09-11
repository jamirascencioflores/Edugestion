package com.omnis.saas.academico.domain.ports.out;

import com.omnis.saas.academico.domain.model.Estudiante;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.EstudianteEntity;

import java.util.List;
import java.util.Optional;

public interface EstudianteRepositoryPort {
    Estudiante guardar(Estudiante estudiante);
    List<Estudiante> buscarTodos();
    Optional<Estudiante> buscarPorId(Long id); // 👈 Nuevo
    void eliminarPorId(Long id); // 👈 Nuevo
    List<Estudiante> buscarPorSeccion(Long seccionId);
    long contarPorColegioId(Long colegioId);
}