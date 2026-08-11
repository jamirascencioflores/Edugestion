package com.omnis.saas.academico.domain.model;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class Estudiante {
    private Long id;
    private String nombres;
    private String apellidos;
    private String dni;
    private LocalDate fechaNacimiento;
    private String emailInstitucional;
    private Long seccionId;
    private Long colegioId;
    private Boolean estado;
    private List<Long> apoderadoIds;

    // 👇 Datos de Contacto Directo del Apoderado (Principal)
    private String nombreApoderado;
    private String dniApoderado;
    private String telefonoApoderado;
    private String parentescoApoderado;

    public String getNombreCompleto() {
        return this.nombres + " " + this.apellidos;
    }
}