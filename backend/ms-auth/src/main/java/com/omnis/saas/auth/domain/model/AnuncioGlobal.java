package com.omnis.saas.auth.domain.model;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnuncioGlobal {
    private Long id;
    private String titulo;
    private String mensaje;
    private String tipo; // INFORMATIVO, MANTENIMIENTO, URGENTE
    private Boolean activo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaVencimiento; // Opcional: para que se desactive solo
}