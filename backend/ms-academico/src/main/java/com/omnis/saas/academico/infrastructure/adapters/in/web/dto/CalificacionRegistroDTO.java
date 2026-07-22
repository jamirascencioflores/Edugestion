package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CalificacionRegistroDTO(
        @NotNull(message = "El ID del estudiante es obligatorio")
        Long estudianteId,

        @NotNull(message = "El ID del curso es obligatorio")
        Long cursoId,

        @NotNull(message = "El ID del docente es obligatorio")
        String docenteId,

        @NotBlank(message = "El periodo es obligatorio")
        String periodo,

        @NotBlank(message = "El valor de la nota es obligatorio")
        String valor,

        String comentario
) {}