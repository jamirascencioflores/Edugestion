package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;
import com.omnis.saas.academico.domain.model.Asignacion;

public record AsignacionRegistroDTO(Long seccionId, Long cursoId, String docenteId) {
    public Asignacion toDomain(Long colegioId) {
        return Asignacion.builder()
                .seccionId(this.seccionId)
                .cursoId(this.cursoId)
                .docenteId(this.docenteId)
                .colegioId(colegioId)
                .estado(true)
                .build();
    }
}