package com.omnis.saas.auth.infrastructure.adapters.in.web.dto;

import com.omnis.saas.auth.domain.model.Usuario;

public record UsuarioRegistroDTO(
        String nombreCompleto,
        String email,
        String rol
) {

    public Usuario toDomain() {
        return Usuario.builder()
                .nombreCompleto(this.nombreCompleto())
                .email(this.email())
                .estado(false)
                .build();
    }
}