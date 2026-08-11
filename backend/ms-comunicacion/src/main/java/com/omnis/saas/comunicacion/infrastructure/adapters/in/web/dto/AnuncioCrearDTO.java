package com.omnis.saas.comunicacion.infrastructure.adapters.in.web.dto;

import com.omnis.saas.comunicacion.domain.model.Anuncio;
import com.omnis.saas.comunicacion.domain.model.PrioridadAnuncio;

public record AnuncioCrearDTO(
        String titulo,
        String contenido,
        Long gradoId,
        Long seccionId,
        PrioridadAnuncio prioridad
) {
    public Anuncio toDomain(Long colegioId) {
        return Anuncio.builder()
                .colegioId(colegioId)
                .titulo(this.titulo)
                .contenido(this.contenido)
                .gradoId(this.gradoId)
                .seccionId(this.seccionId)
                .prioridad(this.prioridad != null ? this.prioridad : PrioridadAnuncio.MEDIA)
                .build();
    }
}