package com.omnis.saas.auth.infrastructure.adapters.in.web.dto;

import com.omnis.saas.auth.domain.model.Usuario;

public record UsuarioRegistroDTO(
        String email,
        String password,
        String rol
) {

    public Usuario toDomain() {
        return Usuario.builder()
                .email(this.email())
                .passwordHash(this.password())
                .estado(true)
                .build();
    }
}