package com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.academico.domain.model.Calificacion;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.CalificacionEntity;
import org.springframework.stereotype.Component;

@Component
public class CalificacionMapper {
    public Calificacion toDomain(CalificacionEntity entity) {
        if (entity == null) return null;
        return Calificacion.builder()
                .id(entity.getId())
                .colegioId(entity.getColegioId())
                .estudianteId(entity.getEstudianteId())
                .cursoId(entity.getCursoId())
                .docenteId(entity.getDocenteId())
                .periodo(entity.getPeriodo())
                .valor(entity.getValor())
                .comentario(entity.getComentario())
                .fechaRegistro(entity.getFechaRegistro())
                .build();
    }

    public CalificacionEntity toEntity(Calificacion domain) {
        if (domain == null) return null;
        return CalificacionEntity.builder()
                .id(domain.getId())
                .colegioId(domain.getColegioId())
                .estudianteId(domain.getEstudianteId())
                .cursoId(domain.getCursoId())
                .docenteId(domain.getDocenteId())
                .periodo(domain.getPeriodo())
                .valor(domain.getValor())
                .comentario(domain.getComentario())
                .fechaRegistro(domain.getFechaRegistro())
                .build();
    }
}