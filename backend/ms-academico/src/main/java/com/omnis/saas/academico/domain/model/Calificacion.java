package com.omnis.saas.academico.domain.model;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class Calificacion {
    private Long id;
    private Long colegioId;
    private Long estudianteId;
    private Long cursoId;
    private String docenteId;
    private String periodo; // Ej: BIMESTRE_1, TRIMESTRE_1, CICLO_1
    private String valor;   // Ej: "A", "AD", "15", "20"
    private String comentario;
    private LocalDate fechaRegistro;
}