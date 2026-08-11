package com.omnis.saas.comunicacion.domain.model;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class Anuncio {
    private Long id;
    private Long colegioId;
    private String titulo;
    private String contenido;
    private Long gradoId;       // null = aplica a todo el colegio
    private Long seccionId;     // null = aplica a todo el grado
    private PrioridadAnuncio prioridad;
    private LocalDateTime fechaPublicacion;
    private Boolean estado;     // true = activo, false = archivado
}