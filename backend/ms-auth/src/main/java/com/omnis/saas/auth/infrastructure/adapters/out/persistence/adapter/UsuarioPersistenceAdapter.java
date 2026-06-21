package com.omnis.saas.auth.infrastructure.adapters.out.persistence.adapter;

import com.omnis.saas.auth.domain.model.Usuario;
import com.omnis.saas.auth.domain.ports.out.UsuarioRepositoryPort;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.UsuarioJpaRepository;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.UsuarioEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.mapper.UsuarioMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UsuarioPersistenceAdapter implements UsuarioRepositoryPort {

    private final UsuarioJpaRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    @Override
    public Usuario guardar(Usuario usuario) {
        return save(usuario);
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email).map(usuarioMapper::toDomain);
    }

    @Override
    public Optional<Usuario> buscarPorId(UUID id) { // <-- Cambiado a UUID
        return usuarioRepository.findById(id).map(usuarioMapper::toDomain);
    }

    @Override
    public Usuario save(Usuario usuario) {
        UsuarioEntity entity = usuarioMapper.toEntity(usuario);
        UsuarioEntity savedEntity = usuarioRepository.save(entity);
        return usuarioMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Usuario> findFirstByColegioIdAndRolNombre(Long colegioId, String rolNombre) {
        return usuarioRepository.findFirstByColegioIdAndRolNombre(colegioId, rolNombre)
                .map(usuarioMapper::toDomain);
    }

    @Override
    public void deleteByColegioId(Long colegioId) {
        usuarioRepository.deleteByColegioId(colegioId);
    }

    @Override
    public Optional<Usuario> buscarPorEmailYColegio(String email, Long colegioId) {
        return usuarioRepository.findByEmailAndColegioId(email, colegioId) // <--- Usa el nombre exacto de tu variable aquí
                .map(usuarioMapper::toDomain); // Utiliza el mapeo que ya usas en tus otros métodos
    }
}