package com.omnis.saas.academico.domain.model;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Grado {
    private Long id;
    private String nombre;
    private Integer orden; // 👈 ¡Faltaba agregar esto aquí!
    private Long colegioId;
    private Boolean estado;
}