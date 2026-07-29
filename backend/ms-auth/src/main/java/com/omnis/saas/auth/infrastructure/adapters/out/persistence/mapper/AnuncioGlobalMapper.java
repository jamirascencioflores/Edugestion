package com.omnis.saas.auth.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.auth.domain.model.AnuncioGlobal;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.AnuncioGlobalEntity;
import org.springframework.stereotype.Component;

@Component
public class AnuncioGlobalMapper {

    public AnuncioGlobal toDomain(AnuncioGlobalEntity entity) {
        if (entity == null) return null;
        return AnuncioGlobal.builder()
                .id(entity.getId())
                .titulo(entity.getTitulo())
                .mensaje(entity.getMensaje())
                .tipo(entity.getTipo())
                .activo(entity.getActivo())
                .fechaCreacion(entity.getFechaCreacion())
                .fechaVencimiento(entity.getFechaVencimiento())
                .build();
    }

    public AnuncioGlobalEntity toEntity(AnuncioGlobal domain) {
        if (domain == null) return null;
        return AnuncioGlobalEntity.builder()
                .id(domain.getId())
                .titulo(domain.getTitulo())
                .mensaje(domain.getMensaje())
                .tipo(domain.getTipo())
                .activo(domain.getActivo())
                .fechaCreacion(domain.getFechaCreacion())
                .fechaVencimiento(domain.getFechaVencimiento())
                .build();
    }
}