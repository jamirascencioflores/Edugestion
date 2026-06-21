package com.omnis.saas.academico.domain.ports.in;

import com.omnis.saas.academico.domain.model.Grado;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.GradoActualizarDTO;

import java.util.List;

public interface GradoUseCase {
    Grado registrar(Grado grado);
    List<Grado> listar();
    Grado actualizar(Long id, GradoActualizarDTO dto, Long colegioId);
    void eliminar(Long id, Long colegioId);
}