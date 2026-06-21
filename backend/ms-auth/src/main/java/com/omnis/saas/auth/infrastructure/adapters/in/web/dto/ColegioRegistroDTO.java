package com.omnis.saas.auth.infrastructure.adapters.in.web.dto;

public record ColegioRegistroDTO(
        String nombre,
        String subdominio,
        String nombreResponsable,
        String emailResponsable,
        String plan
) {}