package com.omnis.saas.academico.infrastructure.adapters.out.messaging.dto;

public record AlumnoRegistradoEvent(
        Long colegioId,
        Long estudianteId,
        Long gradoId,
        Integer anioEscolar
) {}