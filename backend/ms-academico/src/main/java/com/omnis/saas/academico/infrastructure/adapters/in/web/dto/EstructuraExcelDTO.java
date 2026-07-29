package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EstructuraExcelDTO {
    private String nivel;      // Ej. PRIMARIA, SECUNDARIA
    private String grado;      // Ej. 1ro, 2do
    private String seccion;    // Ej. A, B, Unica
    private String curso;      // Ej. Matemática, Comunicación
}