package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

public record CalificacionReporteDTO(
        String curso,
        String valor,
        String comentario
) {}