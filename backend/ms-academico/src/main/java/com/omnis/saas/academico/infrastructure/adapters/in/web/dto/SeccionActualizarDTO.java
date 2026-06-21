package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

public record SeccionActualizarDTO(
        String nombre,
        Integer capacidadMaxima,
        Long gradoId,
        Boolean estado
) {}