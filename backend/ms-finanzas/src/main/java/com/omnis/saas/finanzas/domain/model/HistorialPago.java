package com.omnis.saas.finanzas.domain.model;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistorialPago {
    private Long id;
    private Long deudaId;
    private Long estudianteId;
    private Long colegioId;
    private String tipoOperacion;
    private String motivo;
    private LocalDateTime fechaOperacion;
}