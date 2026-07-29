package com.omnis.saas.academico.domain.model;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Curso {
    private Long id;
    private String nombre;
    private String descripcion;
    private Long colegioId;
    private Boolean estado;
    private Long areaAcademicaId;
}