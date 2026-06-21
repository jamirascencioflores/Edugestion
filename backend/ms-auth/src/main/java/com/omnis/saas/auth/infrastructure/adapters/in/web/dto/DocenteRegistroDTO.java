package com.omnis.saas.auth.infrastructure.adapters.in.web.dto;

public record DocenteRegistroDTO(
        String nombres,
        String apellidos,
        String documentoIdentidad,
        String email,
        String especialidad
) {}