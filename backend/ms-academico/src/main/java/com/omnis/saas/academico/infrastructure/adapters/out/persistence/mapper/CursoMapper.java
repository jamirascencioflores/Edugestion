package com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.academico.domain.model.Curso;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.CursoEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CursoMapper {

    @Mapping(target = "areaAcademicaId", source = "areaAcademica.id")
    Curso toDomain(CursoEntity entity);

    @Mapping(target = "areaAcademica.id", source = "areaAcademicaId")
    CursoEntity toEntity(Curso domain);
}