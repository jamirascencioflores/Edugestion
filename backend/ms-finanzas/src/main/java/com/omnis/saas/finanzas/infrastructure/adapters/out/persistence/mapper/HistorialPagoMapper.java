package com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.finanzas.domain.model.HistorialPago;
import com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.entity.HistorialPagoEntity;
import org.springframework.stereotype.Component;

@Component
public class HistorialPagoMapper {

    public HistorialPagoEntity toEntity(HistorialPago domain) {
        return HistorialPagoEntity.builder()
                .id(domain.getId())
                .deudaId(domain.getDeudaId())
                .estudianteId(domain.getEstudianteId())
                .colegioId(domain.getColegioId())
                .tipoOperacion(domain.getTipoOperacion())
                .motivo(domain.getMotivo())
                .fechaOperacion(domain.getFechaOperacion())
                .build();
    }

    public HistorialPago toDomain(HistorialPagoEntity entity) {
        return HistorialPago.builder()
                .id(entity.getId())
                .deudaId(entity.getDeudaId())
                .estudianteId(entity.getEstudianteId())
                .colegioId(entity.getColegioId())
                .tipoOperacion(entity.getTipoOperacion())
                .motivo(entity.getMotivo())
                .fechaOperacion(entity.getFechaOperacion())
                .build();
    }
}