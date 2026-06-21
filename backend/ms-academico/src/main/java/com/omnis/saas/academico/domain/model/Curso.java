package com.omnis.saas.academico.domain.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Curso {
    private Long id;
    private String nombre;
    private String descripcion;
    private Long colegioId;
    private Boolean estado;
}