package com.omnis.saas.auth.application.services;

import com.omnis.saas.auth.domain.model.Rol;
import com.omnis.saas.auth.domain.ports.in.UsuarioUseCase;
import com.omnis.saas.auth.domain.ports.out.RolRepositoryPort;
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
    private final RolRepositoryPort rolRepositoryPort; // <-- Nuevo puerto inyectado
    private final TokenProviderPort tokenProviderPort;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Usuario registrarNuevoUsuario(Usuario usuario, String nombreRol) {
        if (usuarioRepositoryPort.buscarPorEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        // Buscamos y asignamos el rol usando la constante
        Rol rolAsignado = rolRepositoryPort.findByNombre(nombreRol)
                .orElseThrow(() -> new RuntimeException("Rol no configurado en el sistema"));

        usuario.setRol(rolAsignado);
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

        if (colegioId != null) {
            usuario = usuarioRepositoryPort.buscarPorEmailYColegio(email, colegioId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado en este colegio"));
        } else {
            usuario = usuarioRepositoryPort.buscarPorEmail(email)
                    .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));
        }

        if (!passwordEncoder.matches(password, usuario.getPasswordHash())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        String token = tokenProviderPort.generarToken(usuario);
        return new AuthResponseDTO(token, usuario.getDebeCambiarPassword() != null ? usuario.getDebeCambiarPassword() : false);
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

    @Override
    @Transactional
    public void activarCuentaConToken(String token, String nuevaPassword) {
        // 1. Buscar el usuario por el token de activación
        Usuario usuario = usuarioRepositoryPort.findByTokenActivacion(token)
                .orElseThrow(() -> new RuntimeException("El enlace de activación es inválido o ha expirado."));

        // 2. Encriptar y actualizar la contraseña
        usuario.setPasswordHash(passwordEncoder.encode(nuevaPassword));

        // 3. Limpiar el token, activar el estado y quitar la obligación de cambio temporal
        usuario.setTokenActivacion(null);
        usuario.setEstado(true);
        usuario.setDebeCambiarPassword(false);

        // 4. Guardar cambios
        usuarioRepositoryPort.guardar(usuario);
    }
}