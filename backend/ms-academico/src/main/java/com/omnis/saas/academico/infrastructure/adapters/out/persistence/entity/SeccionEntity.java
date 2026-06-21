package com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

@Entity
@Table(name = "secciones", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"nombre", "grado_id", "colegio_id"})
})
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "colegioId", type = Long.class))
@Filter(name = "tenantFilter", condition = "colegio_id = :colegioId")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeccionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private Integer capacidadMaxima;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grado_id", nullable = false)
    private GradoEntity grado;

    @Column(name = "colegio_id", nullable = false)
    private Long colegioId;

    @Builder.Default
    private Boolean estado = true;

}