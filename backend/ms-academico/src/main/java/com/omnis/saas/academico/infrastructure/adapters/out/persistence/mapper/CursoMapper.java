package com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.academico.domain.model.Curso;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.AreaAcademicaEntity;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.CursoEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CursoMapper {

    default Curso toDomain(CursoEntity entity) {
        if (entity == null) return null;

        return Curso.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .descripcion(entity.getDescripcion())
                .colegioId(entity.getColegioId())
                .estado(entity.getEstado())
                .areaAcademicaId(entity.getAreaAcademica() != null ? entity.getAreaAcademica().getId() : null)
                .build();
    }

    default CursoEntity toEntity(Curso domain) {
        if (domain == null) return null;

        AreaAcademicaEntity areaEntity = null;
        if (domain.getAreaAcademicaId() != null && domain.getAreaAcademicaId() > 0) {
            areaEntity = AreaAcademicaEntity.builder()
                    .id(domain.getAreaAcademicaId())
                    .build();
        }

        return CursoEntity.builder()
                .id(domain.getId())
                .nombre(domain.getNombre())
                .descripcion(domain.getDescripcion())
                .colegioId(domain.getColegioId())
                .estado(domain.getEstado())
                .areaAcademica(areaEntity) // 👈 Si areaAcademicaId es null, pasa 'null' puro garantizado
                .build();
    }
}