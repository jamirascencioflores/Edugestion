package com.omnis.saas.auth.domain.ports.out;

import com.omnis.saas.auth.domain.model.Usuario;
import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepositoryPort {

    Usuario guardar(Usuario usuario);
    Optional<Usuario> buscarPorEmail(String email);
    Optional<Usuario> buscarPorId(UUID id); // <-- Cambiado a UUID

    Usuario save(Usuario usuario);
    Optional<Usuario> findFirstByColegioIdAndRolNombre(Long colegioId, String rolNombre);
    void deleteByColegioId(Long colegioId);

    Optional<Usuario> buscarPorEmailYColegio(String email, Long colegioId);
}