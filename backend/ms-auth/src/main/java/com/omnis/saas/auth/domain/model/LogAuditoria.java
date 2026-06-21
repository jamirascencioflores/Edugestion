package com.omnis.saas.auth.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogAuditoria {
    private Long id;
    private Long colegioId;      // ¿En qué tenant pasó esto?
    private String usuarioEmail; // ¿Quién lo hizo?
    private String accion;       // Ej: "CREAR", "MODIFICAR", "ELIMINAR"
    private String entidad;      // Ej: "Colegio", "Usuario", "Docente"
    private String detalle;      // Ej: "El usuario editó las notas del alumno X"
    private String ipOrigen;     // La dirección IP real desde donde se hizo el cambio
    private LocalDateTime fechaHora;
}