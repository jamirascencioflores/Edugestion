package com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import java.math.BigDecimal;

@Entity
@Table(name = "tarifarios")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@FilterDef(name = "tenantFilter", parameters = {@ParamDef(name = "colegioId", type = Long.class)})
@Filter(name = "tenantFilter", condition = "colegio_id = :colegioId")
public class TarifarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "colegio_id", nullable = false)
    private Long colegioId;

    @Column(name = "grado_id", nullable = false)
    private Long gradoId;

    @Column(name = "monto_mensual", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoMensual;

    @Column(name = "anio_escolar", nullable = false)
    private Integer anioEscolar;

    @Column(nullable = false)
    private Boolean estado;

    @Column(name = "tipo_tarifa", nullable = false, length = 20)
    private String tipoTarifa;
}