package com.omnis.saas.auth.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanSaas {
    private Long id;
    private String nombre;
    private Integer limiteAlumnos;
    private BigDecimal precioMensual;
    private Boolean permitePortalPadres;
    private Boolean permiteNotificaciones;
    private Boolean permiteReportesPdf;
    private Boolean permiteMarcaBlanca;
    private Boolean permiteFinanzasPro;
}