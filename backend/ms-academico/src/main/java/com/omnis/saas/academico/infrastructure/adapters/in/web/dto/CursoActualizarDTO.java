package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;
import com.omnis.saas.academico.domain.model.Curso;

public record CursoActualizarDTO(String nombre, String descripcion, Boolean estado) {
    public Curso toDomain() {
        return Curso.builder().nombre(this.nombre).descripcion(this.descripcion).estado(this.estado).build();
    }
}