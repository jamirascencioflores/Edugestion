package com.omnis.saas.finanzas.infrastructure.adapters.in.web.dto;

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
public class ReporteMorosoDTO {
    private Long estudianteId;
    private String nombreEstudiante;
    private String dni;
    private String gradoSeccion;
    private Long mesesAtrasados;
    private BigDecimal montoTotalDeuda;
    private List<String> mesesPendientes; // Ej: ["Junio", "Julio", "Agosto"]
}