package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

import com.omnis.saas.academico.domain.model.Estudiante;
import java.time.LocalDate;
import java.util.List;

public record EstudianteRegistroDTO(
        String nombres,
        String apellidos,
        String dni,
        LocalDate fechaNacimiento,
        String emailInstitucional,
        Long seccionId,
        List<Long> apoderadoIds,
        Long gradoId,
        Integer anioEscolar,
        LocalDate fechaInscripcion // <-- Campo añadido
) {
    public Estudiante toDomain(Long colegioId) {
        return Estudiante.builder()
                .nombres(this.nombres)
                .apellidos(this.apellidos)
                .dni(this.dni)
                .fechaNacimiento(this.fechaNacimiento)
                .emailInstitucional(this.emailInstitucional)
                .seccionId(this.seccionId)
                .colegioId(colegioId)
                .estado(true)
                .apoderadoIds(this.apoderadoIds != null ? this.apoderadoIds : List.of())
                .build();
    }
}