package com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.academico.domain.model.Curso;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.CursoEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CursoMapper {
    Curso toDomain(CursoEntity entity);
    CursoEntity toEntity(Curso domain);
}