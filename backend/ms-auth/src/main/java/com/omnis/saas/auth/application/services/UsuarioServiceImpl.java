package com.omnis.saas.auth.application.services;

import com.omnis.saas.auth.domain.ports.in.UsuarioUseCase;
import com.omnis.saas.auth.domain.ports.out.TokenProviderPort;
import com.omnis.saas.auth.domain.ports.out.UsuarioRepositoryPort;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.AuthResponseDTO;
import com.omnis.saas.auth.domain.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioUseCase {

    private final UsuarioRepositoryPort usuarioRepositoryPort;
    private final TokenProviderPort tokenProviderPort;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Usuario registrarNuevoUsuario(Usuario usuario) {
        if (usuarioRepositoryPort.buscarPorEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }
        return usuarioRepositoryPort.guardar(usuario);
    }

    @Override
    public Usuario obtenerUsuarioPorEmail(String email) {
        return usuarioRepositoryPort.buscarPorEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Override
    public AuthResponseDTO login(String email, String password, Long colegioId) {
        Usuario usuario;

        // EL INTERRUPTOR MULTI-TENANT
        if (colegioId != null) {
            // Busca en el colegio específico
            usuario = usuarioRepositoryPort.buscarPorEmailYColegio(email, colegioId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado en este colegio"));
        } else {
            // Busca a nivel global (SuperAdmin o sin subdominio)
            usuario = usuarioRepositoryPort.buscarPorEmail(email)
                    .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));
        }

        // Valida la contraseña
        if (!passwordEncoder.matches(password, usuario.getPasswordHash())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        // Genera el token
        String token = tokenProviderPort.generarToken(usuario);

        return new AuthResponseDTO(
                token,
                usuario.getDebeCambiarPassword() != null ? usuario.getDebeCambiarPassword() : false
        );
    }

    @Override
    @Transactional
    public void cambiarPassword(String email, String nuevaPassword) {
        Usuario usuario = usuarioRepositoryPort.buscarPorEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setPasswordHash(passwordEncoder.encode(nuevaPassword));
        usuario.setDebeCambiarPassword(false);

        usuarioRepositoryPort.guardar(usuario);
    }
}