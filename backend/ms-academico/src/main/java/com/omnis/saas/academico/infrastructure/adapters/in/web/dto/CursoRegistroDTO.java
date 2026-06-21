package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;
import com.omnis.saas.academico.domain.model.Curso;

public record CursoRegistroDTO(String nombre, String descripcion) {
    public Curso toDomain(Long colegioId) {
        return Curso.builder().nombre(this.nombre).descripcion(this.descripcion)
                .colegioId(colegioId).estado(true).build();
    }
}