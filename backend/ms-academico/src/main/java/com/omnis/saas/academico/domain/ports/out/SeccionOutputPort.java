package com.omnis.saas.academico.domain.ports.out;

import com.omnis.saas.academico.domain.model.Seccion;
import java.util.Optional;

public interface SeccionOutputPort {
    Seccion guardar(Seccion seccion);
    Optional<Seccion> buscarSeccionPorNombreYGrado(String nombre, Long gradoId);
}