package com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.academico.domain.model.Grado;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.GradoEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GradoMapper {
    Grado toDomain(GradoEntity entity);
    GradoEntity toEntity(Grado domain);
}