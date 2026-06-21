package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

public record GradoActualizarDTO(
        String nombre,
        Integer orden, // 👈 Agregado aquí
        Boolean estado
) {}