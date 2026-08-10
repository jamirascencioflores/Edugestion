package com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity;

import com.omnis.saas.academico.domain.model.EstadoPeriodo;
import com.omnis.saas.academico.domain.model.Periodo;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import java.time.LocalDate;

@Entity
@Table(name = "periodos")
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "colegioId", type = Long.class))
@Filter(name = "tenantFilter", condition = "colegio_id = :colegioId")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PeriodoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private LocalDate fechaInicio;

    @Column(nullable = false)
    private LocalDate fechaFin;

    @Column(name = "colegio_id", nullable = false)
    private Long colegioId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EstadoPeriodo estado = EstadoPeriodo.PENDIENTE;

    public Periodo toDomain() {
        return Periodo.builder()
                .id(this.id)
                .nombre(this.nombre)
                .fechaInicio(this.fechaInicio)
                .fechaFin(this.fechaFin)
                .estado(this.estado)
                .colegioId(this.colegioId)
                .build();
    }
}