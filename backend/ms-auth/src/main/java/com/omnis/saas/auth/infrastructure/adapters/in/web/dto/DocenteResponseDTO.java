package com.omnis.saas.auth.infrastructure.adapters.in.web.dto;

public record DocenteResponseDTO(
        Long id,
        String nombres,
        String apellidos,
        String documentoIdentidad,
        String email,
        String especialidad,
        Boolean estado,
        String usuarioId // 👈 Este es el campo clave para el UUID
) {}