package com.omnis.saas.comunicacion.infrastructure.adapters.out.persistence.entity;

import com.omnis.saas.comunicacion.domain.model.PrioridadAnuncio;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import java.time.LocalDateTime;

@Entity
@Table(name = "anuncios")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@FilterDef(name = "tenantFilter", parameters = {@ParamDef(name = "colegioId", type = Long.class)})
@Filter(name = "tenantFilter", condition = "colegio_id = :colegioId")
public class AnuncioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "colegio_id", nullable = false)
    private Long colegioId;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(name = "grado_id")
    private Long gradoId;

    @Column(name = "seccion_id")
    private Long seccionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PrioridadAnuncio prioridad;

    @Column(name = "fecha_publicacion", nullable = false)
    private LocalDateTime fechaPublicacion;

    @Builder.Default
    @Column(nullable = false)
    private Boolean estado = true;
}