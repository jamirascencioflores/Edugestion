package com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.academico.domain.model.Periodo;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.PeriodoEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PeriodoMapper {
    Periodo toDomain(PeriodoEntity entity);
    PeriodoEntity toEntity(Periodo domain);
}