package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

import com.omnis.saas.academico.domain.model.Seccion;

public record SeccionRegistroDTO(String nombre, Integer capacidadMaxima, Long gradoId) {
    public Seccion toDomain(Long colegioId) {
        return Seccion.builder().nombre(this.nombre).capacidadMaxima(this.capacidadMaxima)
                .gradoId(this.gradoId).colegioId(colegioId).estado(true).build();
    }
}