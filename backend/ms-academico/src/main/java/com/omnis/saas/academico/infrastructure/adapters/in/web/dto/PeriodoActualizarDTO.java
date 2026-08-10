package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

import com.omnis.saas.academico.domain.model.EstadoPeriodo;
import com.omnis.saas.academico.domain.model.Periodo;

import java.time.LocalDate;

public record PeriodoActualizarDTO(
        String nombre,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        EstadoPeriodo estado // 👈 Cambiado de Boolean a EstadoPeriodo
) {
    public Periodo toDomain(Long colegioId) {
        return Periodo.builder()
                .nombre(this.nombre())
                .fechaInicio(this.fechaInicio())
                .fechaFin(this.fechaFin())
                .estado(this.estado())
                .colegioId(colegioId)
                .build();
    }
}