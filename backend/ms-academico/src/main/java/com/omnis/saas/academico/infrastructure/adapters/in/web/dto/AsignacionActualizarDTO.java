package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;
import com.omnis.saas.academico.domain.model.Asignacion;

public record AsignacionActualizarDTO(String docenteId, Boolean estado) {
    public Asignacion toDomain() {
        return Asignacion.builder().docenteId(this.docenteId).estado(this.estado).build();
    }
}