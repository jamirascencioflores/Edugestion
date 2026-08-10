package com.omnis.saas.academico.domain.ports.in;

import com.omnis.saas.academico.domain.model.Seccion;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.SeccionActualizarDTO;

import java.util.List;

public interface SeccionUseCase {
    Seccion registrar(Seccion seccion);
    List<Seccion> listar();
    Seccion buscarPorId(Long id); // 👈 Nuevo contrato
    Seccion actualizar(Long id, SeccionActualizarDTO dto, Long colegioId);
    void eliminar(Long id, Long colegioId);
}