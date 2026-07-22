package com.omnis.saas.auth.domain.model;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    private UUID id;
    private String nombreCompleto;
    private String email;
    private String passwordHash;
    private Colegio colegio;
    private Rol rol;
    private Boolean estado;
    private Boolean debeCambiarPassword;
    private LocalDateTime createdAt;

    // Agrega estos campos para el flujo de invitación por correo
    private String tokenActivacion;
    private LocalDateTime tokenExpiracion;
}