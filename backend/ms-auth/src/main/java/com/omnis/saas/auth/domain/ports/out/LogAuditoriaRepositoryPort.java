package com.omnis.saas.auth.domain.ports.out;

import com.omnis.saas.auth.domain.model.LogAuditoria;
import java.util.List;

public interface LogAuditoriaRepositoryPort {
    void guardar(LogAuditoria log);
    List<LogAuditoria> findAll(); // 👈
}