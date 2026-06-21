package com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity;

import com.omnis.saas.academico.domain.model.Periodo;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import org.hibernate.annotations.*;

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
    private Long colegioId; // <-- El pilar de tu multi-tenant aquí

    @Builder.Default
    private Boolean estado = true;

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