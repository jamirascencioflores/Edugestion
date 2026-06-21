package com.omnis.saas.auth.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfiguracionGlobal {
    private Long id;
    private boolean modoMantenimiento;
    private String mensajeMantenimiento;
}