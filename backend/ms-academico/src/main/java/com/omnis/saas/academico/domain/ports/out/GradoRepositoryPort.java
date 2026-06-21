package com.omnis.saas.academico.domain.ports.out;

import com.omnis.saas.academico.domain.model.Grado;
import java.util.List;
import java.util.Optional;

public interface GradoRepositoryPort {
    Optional<Grado> findById(Long id);
    Grado save(Grado grado);
    void deleteById(Long id);
    List<Grado> findAll();
}