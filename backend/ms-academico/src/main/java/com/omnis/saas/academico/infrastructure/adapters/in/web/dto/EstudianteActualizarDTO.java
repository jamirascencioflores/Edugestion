package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

import java.time.LocalDate;
import java.util.List;

public record EstudianteActualizarDTO(
        String nombres,
        String apellidos,
        String dni,
        LocalDate fechaNacimiento,
        String emailInstitucional,
        Long seccionId,
        Boolean estado,
        List<Long> apoderadoIds
) {}