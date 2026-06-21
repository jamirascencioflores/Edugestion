package com.omnis.saas.auth.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.auth.domain.model.Rol;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.RolEntity;
import org.springframework.stereotype.Component;

@Component
public class RolMapper {

    public Rol toDomain(RolEntity entity) {
        if (entity == null) return null;
        return Rol.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .build();
    }

    public RolEntity toEntity(Rol domain) {
        if (domain == null) return null;
        RolEntity entity = new RolEntity();
        entity.setId(domain.getId());
        entity.setNombre(domain.getNombre());
        return entity;
    }
}