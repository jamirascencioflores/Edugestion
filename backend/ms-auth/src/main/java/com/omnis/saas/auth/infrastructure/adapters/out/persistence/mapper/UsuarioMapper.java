package com.omnis.saas.auth.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.auth.domain.model.Usuario;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.UsuarioEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UsuarioMapper {

    private final RolMapper rolMapper;
    private final ColegioMapper colegioMapper;

    public Usuario toDomain(UsuarioEntity entity) {
        if (entity == null) return null;
        return Usuario.builder()
                .id(entity.getId())
                .nombreCompleto(entity.getNombreCompleto())
                .email(entity.getEmail())
                .passwordHash(entity.getPasswordHash())
                .colegio(colegioMapper.toDomain(entity.getColegio()))
                .rol(rolMapper.toDomain(entity.getRolEntity()))
                .estado(entity.getEstado())
                .debeCambiarPassword(entity.getDebeCambiarPassword())
                .createdAt(entity.getCreatedAt())
                .tokenActivacion(entity.getTokenActivacion()) // <-- Añadido
                .build();
    }

    public UsuarioEntity toEntity(Usuario domain) {
        if (domain == null) return null;
        UsuarioEntity entity = new UsuarioEntity();
        entity.setId(domain.getId());
        entity.setNombreCompleto(domain.getNombreCompleto());
        entity.setEmail(domain.getEmail());
        entity.setPasswordHash(domain.getPasswordHash());
        entity.setColegio(colegioMapper.toEntity(domain.getColegio()));
        entity.setRolEntity(rolMapper.toEntity(domain.getRol()));
        entity.setEstado(domain.getEstado());
        entity.setDebeCambiarPassword(domain.getDebeCambiarPassword());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setTokenActivacion(domain.getTokenActivacion()); // <-- Añadido
        return entity;
    }
}