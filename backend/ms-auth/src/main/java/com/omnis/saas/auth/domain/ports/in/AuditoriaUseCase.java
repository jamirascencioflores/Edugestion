package com.omnis.saas.auth.domain.ports.in;

import com.omnis.saas.auth.domain.model.LogAuditoria;
import java.util.List;

public interface AuditoriaUseCase {
    List<LogAuditoria> obtenerTodos();
}