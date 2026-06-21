package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

import com.omnis.saas.academico.domain.model.Grado;

public record GradoRegistroDTO(String nombre, Integer orden) {
    public Grado toDomain(Long colegioId) {
        return Grado.builder()
                .nombre(this.nombre)
                .orden(this.orden) // 👈 Agregado aquí
                .colegioId(colegioId)
                .estado(true)
                .build();
    }
}