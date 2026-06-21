package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

import com.omnis.saas.academico.domain.model.Periodo;

import java.time.LocalDate;
// Asegúrate de importar tu clase Periodo del dominio

public record PeriodoActualizarDTO(
        String nombre,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        Boolean estado
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