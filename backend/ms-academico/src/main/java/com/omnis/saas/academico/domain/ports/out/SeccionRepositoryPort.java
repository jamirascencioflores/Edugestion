package com.omnis.saas.academico.domain.ports.out;

import com.omnis.saas.academico.domain.model.Seccion;
import java.util.List;
import java.util.Optional;

public interface SeccionRepositoryPort {
    Optional<Seccion> findById(Long id);
    Seccion save(Seccion seccion);
    void deleteById(Long id);
    List<Seccion> findAll();
}