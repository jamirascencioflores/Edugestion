package com.omnis.saas.auth.domain.model;

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
public class SuscripcionColegio {
    private Long id;
    private Long colegioId;
    private String nombreColegio;
    private PlanSaas planBase;

    // Overrides de permisos
    private Boolean permitePortalPadres;
    private Boolean permiteNotificaciones;
    private Boolean permiteReportesPdf;
    private Boolean permiteMarcaBlanca;
    private Boolean permiteFinanzasPro;

    private List<CargoAdicional> cargosAdicionales; // Lista de desglose
    private BigDecimal montoAdicional;              // Suma total de los cargos
    private BigDecimal montoTotalMensual;           // Precio Base + Suma de Cargos
}