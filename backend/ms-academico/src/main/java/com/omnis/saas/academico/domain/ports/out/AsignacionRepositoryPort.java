package com.omnis.saas.academico.domain.ports.out;

import com.omnis.saas.academico.domain.model.Asignacion;
import java.util.List;

public interface AsignacionRepositoryPort {
    Asignacion guardar(Asignacion asignacion);
    List<Asignacion> buscarPorSeccion(Long seccionId);
    Asignacion buscarPorId(Long id);
    void eliminar(Long id);
    List<Asignacion> buscarPorDocente(String docenteId); // Nuevo
}