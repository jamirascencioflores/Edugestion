package com.omnis.saas.auth.domain.model;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Colegio {
    private Long id;
    private PlanSaas plan;
    private String nombre;
    private String subdominio;
    private String logoUrl;
    private String direccion;
    private String telefono;
    private Boolean estado; // true = Activo, false = Inactivo
    private LocalDateTime createdAt;
    private List<Usuario> usuarios;
    private String estadoSuscripcion;
    private LocalDate fechaVencimientoSuscripcion;
}