package com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cursos", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"nombre", "colegio_id"})
})
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "colegioId", type = Long.class))
@Filter(name = "tenantFilter", condition = "colegio_id = :colegioId")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CursoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(name = "colegio_id", nullable = false)
    private Long colegioId;

    @Builder.Default
    private Boolean estado = true;

    // --- NUEVA RELACIÓN ---
    // Un curso pertenece a una sola Área (ej. "Matemática" pertenece a "Ciencias")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id")
    private AreaAcademicaEntity areaAcademica;
}