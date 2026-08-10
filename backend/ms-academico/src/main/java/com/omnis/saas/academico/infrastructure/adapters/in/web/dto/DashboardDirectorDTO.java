package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDirectorDTO {
    private Long totalEstudiantes;
    private Double porcentajeCrecimientoEstudiantes;
    private Long seccionesActivas;

    private Long totalDocentes;
    private Long docentesSinAsignar;

    private BigDecimal recaudoMesActual;
    private Double porcentajeRecaudoMes;

    private Double porcentajeMorosidad;
    private Long alumnosMorosos;

    private List<RecaudacionMensualDTO> recaudacionMensual;
    private AlertasDTO alertas;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RecaudacionMensualDTO {
        private String mes;
        private Double recaudado;
        private Double pendiente;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AlertasDTO {
        private Integer contratosPorVencer;
    }
}