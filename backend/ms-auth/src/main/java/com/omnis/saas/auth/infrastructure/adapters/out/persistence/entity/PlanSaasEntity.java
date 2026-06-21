package com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "planes_saas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PlanSaasEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre; // BÁSICO, PREMIUM
    private Integer limiteAlumnos; // 300 para Básico, 999999 para Premium
    private BigDecimal precioMensual;

    // --- FLAGS DE FUNCIONALIDAD (NUEVO) ---

    private Boolean permitePortalPadres;    // Básico: false | Premium: true
    private Boolean permiteNotificaciones;  // RabbitMQ (Email automático)
    private Boolean permiteReportesPdf;     // Boletas y Recibos PRO
    private Boolean permiteMarcaBlanca;      // Ocultar logo EduGestión
    private Boolean permiteFinanzasPro;      // Morosidad predictiva
}