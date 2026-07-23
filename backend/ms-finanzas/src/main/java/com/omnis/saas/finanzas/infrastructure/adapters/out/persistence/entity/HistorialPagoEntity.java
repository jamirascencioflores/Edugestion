package com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_pagos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistorialPagoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "deuda_id", nullable = false)
    private Long deudaId;

    @Column(name = "estudiante_id", nullable = false)
    private Long estudianteId;

    @Column(name = "colegio_id", nullable = false)
    private Long colegioId; // Fundamental mantenerlo por tu arquitectura multitenant

    @Column(name = "tipo_operacion", nullable = false)
    private String tipoOperacion; // Valores sugeridos: "COBRO" o "REVERSION"

    @Column(name = "motivo")
    private String motivo;

    @Column(name = "fecha_operacion", nullable = false)
    private LocalDateTime fechaOperacion;

    @PrePersist
    protected void onCreate() {
        this.fechaOperacion = LocalDateTime.now();
    }
}