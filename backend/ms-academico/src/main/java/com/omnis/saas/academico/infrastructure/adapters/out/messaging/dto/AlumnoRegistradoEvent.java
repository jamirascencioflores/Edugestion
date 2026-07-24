package com.omnis.saas.academico.infrastructure.adapters.out.messaging.dto;

import java.time.LocalDate;

public record AlumnoRegistradoEvent(
        Long colegioId,
        Long estudianteId,
        Long gradoId,
        Integer anioEscolar,
        LocalDate fechaInscripcion // <-- Campo añadido
) {}