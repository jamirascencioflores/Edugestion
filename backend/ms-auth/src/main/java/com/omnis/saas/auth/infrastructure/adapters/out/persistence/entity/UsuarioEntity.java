package com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "usuarios", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"email", "colegio_id"})
})
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "colegio_id")
    private ColegioEntity colegio;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rol_id")
    private RolEntity rolEntity;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Builder.Default // <-- Agrega esto
    private Boolean estado = true;

    @Column(name = "nombre_completo")
    private String nombreCompleto;

    @Builder.Default
    @Column(name = "debe_cambiar_password")
    private Boolean debeCambiarPassword = true;

    // Campos de Auditoría
    @Builder.Default // <--- Esto es vital para que el Builder lo respete
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}