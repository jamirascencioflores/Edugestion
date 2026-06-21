package com.omnis.saas.finanzas.domain.model;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class Deuda {
    private Long id;
    private Long colegioId;
    private Long estudianteId;
    private String concepto; // Ej: "Pensión Marzo - 2026"
    private BigDecimal monto;
    private LocalDate fechaVencimiento;
    private EstadoDeuda estado;
    private String numeroOperacion;
    private String motivoReversion;
}