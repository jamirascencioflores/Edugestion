package com.omnis.saas.finanzas.infrastructure.adapters.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumenFinancieroDTO {
    private BigDecimal recaudoMesActual;
    private Double porcentajeRecaudoMes;
    private Double porcentajeMorosidad;
    private Long alumnosMorosos;
}