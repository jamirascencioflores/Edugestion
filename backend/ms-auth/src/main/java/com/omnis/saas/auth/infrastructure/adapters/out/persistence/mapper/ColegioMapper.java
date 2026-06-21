package com.omnis.saas.auth.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.auth.domain.model.Colegio;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.ColegioEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ColegioMapper {

    private final PlanSaasMapper planSaasMapper;

    public Colegio toDomain(ColegioEntity entity) {
        if (entity == null) return null;
        return Colegio.builder()
                .id(entity.getId())
                .plan(planSaasMapper.toDomain(entity.getPlan()))
                .nombre(entity.getNombre())
                .subdominio(entity.getSubdominio())
                .logoUrl(entity.getLogoUrl())
                .direccion(entity.getDireccion())
                .telefono(entity.getTelefono())
                .estado(entity.getEstado())
                .createdAt(entity.getCreatedAt())
                .estadoSuscripcion(entity.getEstadoSuscripcion())
                // Nota: Los usuarios vinculados no se mapean aquí para evitar bucles infinitos (Lazy Loading)
                .build();
    }

    public ColegioEntity toEntity(Colegio domain) {
        if (domain == null) return null;
        ColegioEntity entity = new ColegioEntity();
        entity.setId(domain.getId());
        entity.setPlan(planSaasMapper.toEntity(domain.getPlan()));
        entity.setNombre(domain.getNombre());
        entity.setSubdominio(domain.getSubdominio());
        entity.setLogoUrl(domain.getLogoUrl());
        entity.setDireccion(domain.getDireccion());
        entity.setTelefono(domain.getTelefono());
        entity.setEstado(domain.getEstado());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setEstadoSuscripcion(domain.getEstadoSuscripcion());
        return entity;
    }

    // 👇 AQUÍ ESTÁ EL MÉTODO NUEVO 👇
    public void updateEntityFromDomain(Colegio domain, ColegioEntity entity) {
        if (domain == null || entity == null) return;

        // Actualizamos los campos de la entidad que ya existe en la Base de Datos
        // IMPORTANTE: Al no tocar la lista de usuarios, Hibernate la dejará intacta y ya no hará DELETE.
        if (domain.getPlan() != null) {
            entity.setPlan(planSaasMapper.toEntity(domain.getPlan()));
        }

        if (domain.getNombre() != null) entity.setNombre(domain.getNombre());
        if (domain.getSubdominio() != null) entity.setSubdominio(domain.getSubdominio());
        if (domain.getLogoUrl() != null) entity.setLogoUrl(domain.getLogoUrl());
        if (domain.getDireccion() != null) entity.setDireccion(domain.getDireccion());
        if (domain.getTelefono() != null) entity.setTelefono(domain.getTelefono());
        if (domain.getEstado() != null) entity.setEstado(domain.getEstado());
        if (domain.getEstadoSuscripcion() != null) entity.setEstadoSuscripcion(domain.getEstadoSuscripcion());
    }
}