package com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RolEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nombre; // Ej: SUPERADMIN, ADMIN_COLEGIO, DOCENTE
}