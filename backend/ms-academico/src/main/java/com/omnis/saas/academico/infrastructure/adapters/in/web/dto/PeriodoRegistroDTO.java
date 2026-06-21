package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

import com.omnis.saas.academico.domain.model.Periodo;
import java.time.LocalDate;

public record PeriodoRegistroDTO(
        String nombre,
        LocalDate fechaInicio,
        LocalDate fechaFin
) {
    // Convertimos el DTO al modelo de dominio inyectando el colegioId
    public Periodo toDomain(Long colegioId) {
        return Periodo.builder()
                .nombre(this.nombre)
                .fechaInicio(this.fechaInicio)
                .fechaFin(this.fechaFin)
                .colegioId(colegioId)
                .estado(true)
                .build();
    }
}