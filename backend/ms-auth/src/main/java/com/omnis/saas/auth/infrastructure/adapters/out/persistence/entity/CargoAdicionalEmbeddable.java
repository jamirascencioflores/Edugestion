package com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.math.BigDecimal;

@Embeddable
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CargoAdicionalEmbeddable {
    private String concepto;
    private BigDecimal monto;
}