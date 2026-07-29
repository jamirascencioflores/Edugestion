package com.omnis.saas.academico.domain.ports.out;

import com.omnis.saas.academico.domain.model.Grado;
import java.util.Optional;

public interface GradoOutputPort {
    Grado guardar(Grado grado);
    Optional<Grado> buscarGradoPorNombreYColegio(String nombre, Long colegioId);
}