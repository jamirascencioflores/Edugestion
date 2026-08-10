package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class GenerarPeriodosDTO {
    private Integer anioEscolar;   // Ej: 2026
    private String tipoModalidad;  // "BIMESTRAL" o "TRIMESTRAL"
    private LocalDate fechaInicio; // Ej: 2026-03-02
}