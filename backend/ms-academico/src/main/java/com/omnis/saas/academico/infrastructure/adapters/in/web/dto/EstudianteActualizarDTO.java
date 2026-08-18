package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

import java.time.LocalDate;
import java.util.List;

public record EstudianteActualizarDTO(
        String nombres,
        String apellidos,
        String dni,
        LocalDate fechaNacimiento,
        LocalDate fechaInscripcion, // 👈 Agregado para soportar edición de fecha de inscripción
        String emailInstitucional,
        Long seccionId,
        Boolean estado,
        List<Long> apoderadoIds,
        // 👇 Nuevos campos para actualización
        String nombreApoderado,
        String dniApoderado,
        String telefonoApoderado,
        String parentescoApoderado
) {}