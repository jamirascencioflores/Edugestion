package com.omnis.saas.academico.domain.model;
import lombok.Builder;
import lombok.Data;

@Data @Builder
public class Asignacion {
    private Long id;
    private Long seccionId;
    private Long cursoId;
    private String docenteId;
    private Long colegioId;
    private Boolean estado;
}