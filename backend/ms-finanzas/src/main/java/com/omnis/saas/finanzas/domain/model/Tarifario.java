package com.omnis.saas.finanzas.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tarifario {
    private Long id;
    private Long colegioId;
    private Long gradoId;
    private BigDecimal montoMensual;
    private Integer anioEscolar;
    private Boolean estado;
}