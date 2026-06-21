package com.omnis.saas.auth.domain.ports.out;

import com.omnis.saas.auth.domain.model.Docente;
import java.util.List;
import java.util.Optional; // <-- No olvides esta importación

public interface DocenteRepositoryPort {
    Docente save(Docente docente);
    List<Docente> findByColegioId(Long colegioId);
    void deleteByColegioId(Long colegioId);

    Optional<Docente> findById(Long id);
    void deleteById(Long id);
}