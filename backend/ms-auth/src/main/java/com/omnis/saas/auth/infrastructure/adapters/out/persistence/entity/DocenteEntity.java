package com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "docentes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"documento_identidad", "colegio_id"}),
        @UniqueConstraint(columnNames = {"email", "colegio_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocenteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombres;

    @Column(nullable = false)
    private String apellidos;

    @Column(nullable = false) // unique = true eliminado
    private String documentoIdentidad;

    @Column(nullable = false) // unique = true eliminado
    private String email;

    private String especialidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "colegio_id", nullable = false)
    private ColegioEntity colegio;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioEntity usuarioEntity; // Cuenta con la que iniciará sesión

    @Builder.Default
    private Boolean estado = true;
}