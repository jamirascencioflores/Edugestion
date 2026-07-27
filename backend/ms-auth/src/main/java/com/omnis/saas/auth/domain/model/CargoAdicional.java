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
public class CargoAdicional {
    private String concepto;  // Ej. "Hosting Dedicado AWS", "Soporte Prioritario 24/7"
    private BigDecimal monto; // Ej. 50.00
}