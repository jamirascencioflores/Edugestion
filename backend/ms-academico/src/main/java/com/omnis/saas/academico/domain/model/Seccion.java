package com.omnis.saas.academico.domain.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Seccion {
    private Long id;
    private String nombre; // Ej: "A"
    private Integer capacidadMaxima;
    private Long gradoId;
    private Long colegioId;
    private Boolean estado;
}