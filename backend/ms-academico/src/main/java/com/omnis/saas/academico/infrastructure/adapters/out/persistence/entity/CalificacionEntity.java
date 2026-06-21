package com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import java.time.LocalDate;

@Entity
@Table(name = "calificaciones")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@FilterDef(name = "tenantFilter", parameters = {@ParamDef(name = "colegioId", type = Long.class)})
@Filter(name = "tenantFilter", condition = "colegio_id = :colegioId")
public class CalificacionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "colegio_id", nullable = false)
    private Long colegioId;

    @Column(name = "estudiante_id", nullable = false)
    private Long estudianteId;

    @Column(name = "curso_id", nullable = false)
    private Long cursoId;

    @Column(name = "docente_id", nullable = false)
    private Long docenteId;

    @Column(nullable = false, length = 50)
    private String periodo;

    @Column(nullable = false, length = 10)
    private String valor;

    @Column(length = 255)
    private String comentario;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDate fechaRegistro;
}