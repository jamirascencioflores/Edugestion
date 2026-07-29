package com.omnis.saas.auth.application.services;

import com.omnis.saas.auth.domain.model.LogAuditoria;
import com.omnis.saas.auth.domain.ports.in.AuditoriaUseCase;
import com.omnis.saas.auth.domain.ports.out.LogAuditoriaRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditoriaServiceImpl implements AuditoriaUseCase {

    private final LogAuditoriaRepositoryPort logAuditoriaRepositoryPort;

    @Override
    public List<LogAuditoria> obtenerTodos() {
        return logAuditoriaRepositoryPort.findAll();
    }
}