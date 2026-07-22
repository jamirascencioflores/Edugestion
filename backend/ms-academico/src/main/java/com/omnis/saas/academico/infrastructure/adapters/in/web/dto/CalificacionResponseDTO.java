package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

import java.time.LocalDate;

public record CalificacionResponseDTO(
        Long id,
        Long estudianteId,
        Long cursoId,
        String docenteId,
        String periodo,
        String valor,
        String comentario,
        LocalDate fechaRegistro
) {}