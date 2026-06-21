package com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.entity;

import com.omnis.saas.finanzas.domain.model.EstadoDeuda;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "deudas")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@FilterDef(name = "tenantFilter", parameters = {@ParamDef(name = "colegioId", type = Long.class)})
@Filter(name = "tenantFilter", condition = "colegio_id = :colegioId")
public class DeudaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "colegio_id", nullable = false)
    private Long colegioId;

    @Column(name = "estudiante_id", nullable = false)
    private Long estudianteId;

    @Column(nullable = false)
    private String concepto;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(name = "fecha_vencimiento", nullable = false)
    private LocalDate fechaVencimiento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoDeuda estado;

    // 👇 Nuevos campos para la auditoría de pagos y reversiones
    @Column(name = "numero_operacion", length = 50)
    private String numeroOperacion;

    @Column(name = "motivo_reversion", length = 255)
    private String motivoReversion;
}