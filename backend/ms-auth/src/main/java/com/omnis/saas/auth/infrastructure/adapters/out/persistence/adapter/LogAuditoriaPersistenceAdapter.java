package com.omnis.saas.auth.infrastructure.adapters.out.persistence.adapter;

import com.omnis.saas.auth.domain.model.LogAuditoria;
import com.omnis.saas.auth.domain.ports.out.LogAuditoriaRepositoryPort;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.LogAuditoriaEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.LogAuditoriaJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LogAuditoriaPersistenceAdapter implements LogAuditoriaRepositoryPort {

    private final LogAuditoriaJpaRepository repository;

    @Override
    public void guardar(LogAuditoria log) {
        LogAuditoriaEntity entity = LogAuditoriaEntity.builder()
                .colegioId(log.getColegioId())
                .usuarioEmail(log.getUsuarioEmail())
                .accion(log.getAccion())
                .entidad(log.getEntidad())
                .detalle(log.getDetalle())
                .ipOrigen(log.getIpOrigen())
                .fechaHora(log.getFechaHora())
                .build();

        repository.save(entity);
    }
}