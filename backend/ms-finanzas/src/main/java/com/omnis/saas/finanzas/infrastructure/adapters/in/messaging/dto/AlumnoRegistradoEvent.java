package com.omnis.saas.finanzas.infrastructure.adapters.in.messaging.dto;

import java.time.LocalDate;

public record AlumnoRegistradoEvent(
        Long colegioId,
        Long estudianteId,
        Long gradoId,
        Integer anioEscolar,
        LocalDate fechaInscripcion // <- Nuevo campo añadido
) {
}