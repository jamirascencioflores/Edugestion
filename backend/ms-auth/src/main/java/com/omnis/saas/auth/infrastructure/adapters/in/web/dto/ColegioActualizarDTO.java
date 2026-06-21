package com.omnis.saas.auth.infrastructure.adapters.in.web.dto;

public record ColegioActualizarDTO(
        String nombre,
        String plan,
        String nombreResponsable
) {}