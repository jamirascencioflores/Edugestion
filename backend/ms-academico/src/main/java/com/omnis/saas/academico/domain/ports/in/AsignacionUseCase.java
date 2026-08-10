package com.omnis.saas.academico.domain.ports.in;

import com.omnis.saas.academico.domain.model.Asignacion;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.AsignacionClonarDTO;
import java.util.List;

public interface AsignacionUseCase {
    Asignacion registrar(Asignacion asignacion);
    List<Asignacion> listarPorSeccion(Long seccionId);
    Asignacion buscarPorId(Long id);
    Asignacion actualizar(Long id, Asignacion asignacion);
    void eliminar(Long id);
    List<Asignacion> listarPorDocente(String docenteId);
    void clonarMalla(AsignacionClonarDTO dto, Long colegioId);
}