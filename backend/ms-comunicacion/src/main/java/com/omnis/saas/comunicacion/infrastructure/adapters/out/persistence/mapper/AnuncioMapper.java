package com.omnis.saas.comunicacion.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.comunicacion.domain.model.Anuncio;
import com.omnis.saas.comunicacion.infrastructure.adapters.out.persistence.entity.AnuncioEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AnuncioMapper {
    Anuncio toDomain(AnuncioEntity entity);
    AnuncioEntity toEntity(Anuncio domain);
}