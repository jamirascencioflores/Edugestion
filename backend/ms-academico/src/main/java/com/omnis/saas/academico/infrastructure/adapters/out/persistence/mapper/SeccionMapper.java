package com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.academico.domain.model.Seccion;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.SeccionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SeccionMapper {

    @Mapping(source = "grado.id", target = "gradoId")
    Seccion toDomain(SeccionEntity entity);

    @Mapping(source = "gradoId", target = "grado.id")
    SeccionEntity toEntity(Seccion domain);
}