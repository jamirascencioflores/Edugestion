package com.omnis.saas.finanzas.infrastructure.adapters.in.web.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DeudaResponseDTO(
        Long id,
        String concepto,
        BigDecimal monto,
        LocalDate fechaVencimiento,
        String estado
) {}