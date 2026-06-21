package com.omnis.saas.auth.domain.ports.out;

import com.omnis.saas.auth.domain.model.LogAuditoria;

public interface LogAuditoriaRepositoryPort {
    void guardar(LogAuditoria log);
}