package com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.academico.domain.model.Asignacion;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.AsignacionEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AsignacionMapper {
    Asignacion toDomain(AsignacionEntity entity);
    AsignacionEntity toEntity(Asignacion domain);
}