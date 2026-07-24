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

    private final UsuarioJpaRepository usuarioRepository; // Usamos este nombre único
    private final UsuarioMapper usuarioMapper;

    @Override
    public Usuario guardar(Usuario usuario) {
        UsuarioEntity entity = usuarioMapper.toEntity(usuario);
        UsuarioEntity savedEntity = usuarioRepository.save(entity);
        return usuarioMapper.toDomain(savedEntity);
    }

    @Override
    public Usuario save(Usuario usuario) {
        return guardar(usuario); // Redirige al método unificado
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email).map(usuarioMapper::toDomain);
    }

    @Override
    public Optional<Usuario> buscarPorId(UUID id) {
        return usuarioRepository.findById(id).map(usuarioMapper::toDomain);
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
        return usuarioRepository.findByEmailAndColegioId(email, colegioId)
                .map(usuarioMapper::toDomain);
    }

    @Override
    public Optional<Usuario> findByTokenActivacion(String token) {
        return usuarioRepository.findByTokenActivacion(token)
                .map(usuarioMapper::toDomain);
    }

    @Override
    public Optional<Usuario> findByTokenRecuperacion(String token) {
        return usuarioRepository.findByTokenRecuperacion(token)
                .map(usuarioMapper::toDomain);
    }

}