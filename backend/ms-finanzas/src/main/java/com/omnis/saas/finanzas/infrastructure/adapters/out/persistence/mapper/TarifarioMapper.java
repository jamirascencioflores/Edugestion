package com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.finanzas.domain.model.Tarifario;
import com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.entity.TarifarioEntity;
import org.springframework.stereotype.Component;

@Component
public class TarifarioMapper {
    public Tarifario toDomain(TarifarioEntity entity) {
        if (entity == null) return null;
        return Tarifario.builder()
                .id(entity.getId())
                .colegioId(entity.getColegioId())
                .gradoId(entity.getGradoId())
                .montoMensual(entity.getMontoMensual())
                .anioEscolar(entity.getAnioEscolar())
                .estado(entity.getEstado())
                .build();
    }

    public TarifarioEntity toEntity(Tarifario domain) {
        if (domain == null) return null;
        return TarifarioEntity.builder()
                .id(domain.getId())
                .colegioId(domain.getColegioId())
                .gradoId(domain.getGradoId())
                .montoMensual(domain.getMontoMensual())
                .anioEscolar(domain.getAnioEscolar())
                .estado(domain.getEstado())
                .build();
    }
}