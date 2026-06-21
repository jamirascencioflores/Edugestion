package com.omnis.saas.auth.domain.ports.in;

import com.omnis.saas.auth.domain.model.Colegio;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.ColegioActualizarDTO;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.ColegioRegistroDTO;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.ColegioResumenDTO;

import java.util.List;

public interface ColegioUseCase {
    Colegio registrarNuevoColegio(ColegioRegistroDTO dto);
    List<ColegioResumenDTO> listarTodos();
    Colegio actualizarColegio(Long id, ColegioActualizarDTO dto);
    void cambiarEstado(Long id);
    void eliminarColegio(Long id);
    boolean validarSubdominio(String subdominio);
}