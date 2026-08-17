package com.omnis.saas.finanzas.infrastructure.adapters.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HistorialReporteDTO {
    private String fecha;
    private String operador;
    private String tipoOperacion;
    private String monto;
    private String motivo;
}