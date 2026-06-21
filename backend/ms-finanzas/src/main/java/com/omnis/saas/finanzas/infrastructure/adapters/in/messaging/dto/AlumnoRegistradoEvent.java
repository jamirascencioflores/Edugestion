package com.omnis.saas.finanzas.infrastructure.adapters.in.messaging.dto;

public record AlumnoRegistradoEvent(
        Long colegioId,
        Long estudianteId,
        Long gradoId,
        Integer anioEscolar
) {}