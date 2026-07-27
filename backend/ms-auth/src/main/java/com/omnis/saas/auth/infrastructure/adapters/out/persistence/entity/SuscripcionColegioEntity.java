package com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "suscripciones_colegios")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SuscripcionColegioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "colegio_id", nullable = false, unique = true)
    private Long colegioId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private PlanSaasEntity planBase;

    private Boolean permitePortalPadres;
    private Boolean permiteNotificaciones;
    private Boolean permiteReportesPdf;
    private Boolean permiteMarcaBlanca;
    private Boolean permiteFinanzasPro;

    // Mapeo de la lista de cargos adicionales
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "suscripcion_cargos_adicionales",
            joinColumns = @JoinColumn(name = "suscripcion_id")
    )
    private List<CargoAdicionalEmbeddable> cargosAdicionales = new ArrayList<>();

    private BigDecimal montoAdicional;
    private BigDecimal montoTotalMensual;
}