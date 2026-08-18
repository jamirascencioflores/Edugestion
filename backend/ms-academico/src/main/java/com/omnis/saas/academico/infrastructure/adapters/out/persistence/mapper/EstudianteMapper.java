package com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.academico.domain.model.Estudiante;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.EstudianteEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EstudianteMapper {

    @Mapping(source = "seccion.id", target = "seccionId")
    Estudiante toDomain(EstudianteEntity entity);

    @Mapping(source = "seccionId", target = "seccion.id")
    EstudianteEntity toEntity(Estudiante domain);
}