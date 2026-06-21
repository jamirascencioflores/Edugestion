package com.omnis.saas.auth.domain.ports.in;

import com.omnis.saas.auth.domain.model.Docente;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.DocenteActualizarDTO;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.DocenteRegistroDTO;
import java.util.List;

public interface DocenteUseCase {
    Docente registrarDocente(DocenteRegistroDTO dto, Long colegioId);
    List<Docente> listarPorColegio(Long colegioId);
    Docente actualizarDocente(Long id, DocenteActualizarDTO dto, Long colegioId);
    void eliminarDocente(Long id, Long colegioId);
}