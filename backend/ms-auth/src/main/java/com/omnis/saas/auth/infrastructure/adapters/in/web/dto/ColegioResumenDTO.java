package com.omnis.saas.auth.infrastructure.adapters.in.web.dto;

public record ColegioResumenDTO(
        Long id,
        String nombre,
        String subdominio,
        String plan,
        String responsableNombre,
        String responsableEmail,
        Boolean estado
) {}