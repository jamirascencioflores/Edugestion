package com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "areas_academicas", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"nombre", "colegio_id"})
})
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "colegioId", type = Long.class))
@Filter(name = "tenantFilter", condition = "colegio_id = :colegioId")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AreaAcademicaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    // Aquí guardamos el UUID del docente (desde ms-auth) que supervisa el área
    @Column(name = "coordinador_id")
    private String coordinadorId;

    @Column(name = "colegio_id", nullable = false)
    private Long colegioId;

    @Builder.Default
    private Boolean estado = true;
}