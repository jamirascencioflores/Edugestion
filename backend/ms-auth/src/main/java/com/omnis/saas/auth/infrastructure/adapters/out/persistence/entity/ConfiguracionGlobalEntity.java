package com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "configuracion_global")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfiguracionGlobalEntity extends AuditableEntity { // Extendemos para saber quién activó el mantenimiento

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "modo_mantenimiento", nullable = false)
    private boolean modoMantenimiento = false;

    @Column(name = "mensaje_mantenimiento")
    private String mensajeMantenimiento;
}