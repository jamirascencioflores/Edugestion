package com.omnis.saas.auth.infrastructure.adapters.in.web.dto;

import com.omnis.saas.auth.domain.model.Usuario;

public record UsuarioRegistroDTO(String email, String password) {

    // Método para convertir el DTO a modelo de Dominio puro
    public Usuario toDomain() {
        return Usuario.builder()
                .email(this.email())
                .passwordHash(this.password()) // La encriptación real la hace el servicio
                .estado(true)
                .build();
    }
}