package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

import java.util.List;

public record AsignacionClonarDTO(
        Long seccionOrigenId,
        List<Long> seccionesDestinoIds,
        Boolean incluirDocentes
) {}