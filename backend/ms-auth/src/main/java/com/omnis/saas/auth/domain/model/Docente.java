package com.omnis.saas.auth.domain.model;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Docente {
    private Long id;
    private String nombres;
    private String apellidos;
    private String documentoIdentidad;
    private String email;
    private String especialidad;
    private Colegio colegio;
    private Usuario usuario;
    private Boolean estado;
}