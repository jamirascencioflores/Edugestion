package com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "colegios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ColegioEntity extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    private PlanSaasEntity plan;

    @Column(nullable = false)
    private String nombre;

    @Column(unique = true, nullable = false)
    private String subdominio;

    private String logoUrl;
    private String direccion;
    private String telefono;

    @Builder.Default
    private Boolean estado = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @Builder.Default
    @OneToMany(mappedBy = "colegio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UsuarioEntity> usuarioEntities = new ArrayList<>();

    @Column(name = "estado_suscripcion")
    private String estadoSuscripcion;

    @Column(name = "fecha_vencimiento_suscripcion")
    private LocalDate fechaVencimientoSuscripcion;
}