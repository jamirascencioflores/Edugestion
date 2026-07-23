package com.omnis.saas.academico.domain.ports.in;

import com.omnis.saas.academico.domain.model.Estudiante;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.EstudianteActualizarDTO;
import java.util.List;

public interface EstudianteUseCase {
    Estudiante registrar(Estudiante estudiante, Long gradoId, Integer anioEscolar);
    List<Estudiante> listar();
    Estudiante actualizar(Long id, EstudianteActualizarDTO dto, Long colegioId);
    void eliminar(Long id, Long colegioId);
    List<Estudiante> listarPorSeccion(Long seccionId);
    Estudiante buscarPorId(Long id); // 👈 Añadido para el Feign Client
}