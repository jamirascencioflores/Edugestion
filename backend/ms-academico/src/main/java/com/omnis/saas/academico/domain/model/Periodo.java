package com.omnis.saas.academico.domain.model;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class Periodo {
    private Long id;
    private String nombre; // Ej: "Año Escolar 2026"
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Long colegioId;
    private Boolean estado;
}