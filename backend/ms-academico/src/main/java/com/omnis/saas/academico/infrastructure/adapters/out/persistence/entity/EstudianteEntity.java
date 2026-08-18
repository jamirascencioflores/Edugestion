package com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

@Entity
@Table(name = "estudiantes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"dni", "colegio_id"})
})
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "colegioId", type = Long.class))
@Filter(name = "tenantFilter", condition = "colegio_id = :colegioId")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstudianteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombres;

    @Column(nullable = false)
    private String apellidos;

    @Column(nullable = false, length = 15)
    private String dni;

    @Column(nullable = false)
    private LocalDate fechaNacimiento;

    private String emailInstitucional;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seccion_id", nullable = false)
    private SeccionEntity seccion;

    @Column(name = "colegio_id", nullable = false)
    private Long colegioId;

    @Builder.Default
    private Boolean estado = true;

    @ElementCollection
    @CollectionTable(
            name = "estudiante_apoderados",
            joinColumns = @JoinColumn(name = "estudiante_id")
    )
    @Column(name = "usuario_apoderado_id")
    @Builder.Default
    private List<Long> apoderadoIds = new ArrayList<>();

    // 👇 Nuevos campos para datos directos del apoderado
    @Column(name = "nombre_apoderado")
    private String nombreApoderado;

    @Column(name = "dni_apoderado", length = 15)
    private String dniApoderado;

    @Column(name = "telefono_apoderado", length = 20)
    private String telefonoApoderado;

    @Column(name = "parentesco_apoderado", length = 50)
    private String parentescoApoderado;

    @Column(name = "fecha_inscripcion")
    private LocalDate fechaInscripcion;
}