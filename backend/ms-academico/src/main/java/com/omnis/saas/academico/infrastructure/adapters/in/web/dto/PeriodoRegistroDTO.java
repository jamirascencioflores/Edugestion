package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

import com.omnis.saas.academico.domain.model.EstadoPeriodo;
import com.omnis.saas.academico.domain.model.Periodo;
import java.time.LocalDate;

public record PeriodoRegistroDTO(
        String nombre,
        LocalDate fechaInicio,
        LocalDate fechaFin
) {
    public Periodo toDomain(Long colegioId) {
        return Periodo.builder()
                .nombre(this.nombre)
                .fechaInicio(this.fechaInicio)
                .fechaFin(this.fechaFin)
                .colegioId(colegioId)
                .estado(EstadoPeriodo.PENDIENTE) // 👈 Cambiado de true a EstadoPeriodo.PENDIENTE
                .build();
    }
}