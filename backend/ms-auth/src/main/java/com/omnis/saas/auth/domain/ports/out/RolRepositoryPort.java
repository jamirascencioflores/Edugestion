package com.omnis.saas.auth.domain.ports.out;

import com.omnis.saas.auth.domain.model.Rol;
import java.util.Optional;

public interface RolRepositoryPort {
    Optional<Rol> findByNombre(String nombre);
}