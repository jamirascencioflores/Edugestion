package com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.finanzas.domain.model.Deuda;
import com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.entity.DeudaEntity;
import org.springframework.stereotype.Component;

@Component
public class DeudaMapper {

    public Deuda toDomain(DeudaEntity entity) {
        if (entity == null) return null;
        return Deuda.builder()
                .id(entity.getId())
                .colegioId(entity.getColegioId())
                .estudianteId(entity.getEstudianteId())
                .concepto(entity.getConcepto())
                .monto(entity.getMonto())
                .fechaVencimiento(entity.getFechaVencimiento())
                .estado(entity.getEstado())
                .numeroOperacion(entity.getNumeroOperacion())
                .motivoReversion(entity.getMotivoReversion())
                .build();
    }

    public DeudaEntity toEntity(Deuda domain) {
        if (domain == null) return null;
        return DeudaEntity.builder()
                .id(domain.getId())
                .colegioId(domain.getColegioId())
                .estudianteId(domain.getEstudianteId())
                .concepto(domain.getConcepto())
                .monto(domain.getMonto())
                .fechaVencimiento(domain.getFechaVencimiento())
                .estado(domain.getEstado())
                .numeroOperacion(domain.getNumeroOperacion())
                .motivoReversion(domain.getMotivoReversion())
                .build();
    }
}