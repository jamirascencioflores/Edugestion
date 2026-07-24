package com.omnis.saas.auth.application.services;

import com.omnis.saas.auth.domain.model.Rol;
import com.omnis.saas.auth.domain.ports.in.UsuarioUseCase;
import com.omnis.saas.auth.domain.ports.out.RolRepositoryPort;
import com.omnis.saas.auth.domain.ports.out.TokenProviderPort;
import com.omnis.saas.auth.domain.ports.out.UsuarioRepositoryPort;
import com.omnis.saas.auth.domain.ports.out.EmailServicePort;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.AuthResponseDTO;
import com.omnis.saas.auth.domain.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioUseCase {

    private final UsuarioRepositoryPort usuarioRepositoryPort;
    private final RolRepositoryPort rolRepositoryPort;
    private final TokenProviderPort tokenProviderPort;
    private final PasswordEncoder passwordEncoder;
    private final EmailServicePort emailServicePort;

    @Override
    public Usuario registrarNuevoUsuario(Usuario usuario, String nombreRol) {
        if (usuarioRepositoryPort.buscarPorEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        Rol rolAsignado = rolRepositoryPort.findByNombre(nombreRol)
                .orElseThrow(() -> new RuntimeException("Rol no configurado en el sistema"));

        usuario.setRol(rolAsignado);

        // 1. Asignar hash temporal para cumplir el constraint de la BD
        if (usuario.getPasswordHash() == null) {
            usuario.setPasswordHash(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
        }

        // 2. Generar y asignar el token de activación
        String tokenActivacion = java.util.UUID.randomUUID().toString();
        usuario.setTokenActivacion(tokenActivacion);

        // 3. Guardar en BD
        Usuario usuarioGuardado = usuarioRepositoryPort.guardar(usuario);

        // 4. Enviar correo de invitación
        emailServicePort.enviarInvitacion(
                usuarioGuardado.getEmail(),
                usuarioGuardado.getNombreCompleto(),
                tokenActivacion
        );

        return usuarioGuardado;
    }

    @Override
    public Usuario obtenerUsuarioPorEmail(String email) {
        return usuarioRepositoryPort.buscarPorEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Override
    public AuthResponseDTO login(String email, String password, Long colegioId) {
        Usuario usuario = usuarioRepositoryPort.buscarPorEmail(email)
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (usuario.getColegio() != null && colegioId != null) {
            if (!usuario.getColegio().getId().equals(colegioId)) {
                throw new RuntimeException("Usuario no pertenece a este colegio");
            }
        }

        if (!passwordEncoder.matches(password, usuario.getPasswordHash())) {
            throw new RuntimeException("Credenciales inválidas");
        }

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

    @Override
    @Transactional
    public void activarCuentaConToken(String token, String nuevaPassword) {
        Usuario usuario = usuarioRepositoryPort.findByTokenActivacion(token)
                .orElseThrow(() -> new RuntimeException("El enlace de activación es inválido o ha expirado."));

        usuario.setPasswordHash(passwordEncoder.encode(nuevaPassword));
        usuario.setTokenActivacion(null);
        usuario.setEstado(true);
        usuario.setDebeCambiarPassword(false);

        usuarioRepositoryPort.guardar(usuario);
    }

    @Override
    @Transactional
    public void solicitarRecuperacionPassword(String email) {
        Optional<Usuario> usuarioOpt = usuarioRepositoryPort.buscarPorEmail(email);

        if (usuarioOpt.isEmpty()) return;

        Usuario usuario = usuarioOpt.get();
        String token = java.util.UUID.randomUUID().toString();

        usuario.setTokenRecuperacion(token);
        usuario.setExpiracionTokenRecuperacion(java.time.LocalDateTime.now().plusMinutes(15));
        usuarioRepositoryPort.guardar(usuario);

        // 6. Usamos tu puerto existente para enviar el correo
        emailServicePort.enviarCorreoRecuperacion(usuario.getEmail(), usuario.getNombreCompleto(), token);
    }

    @Override
    public void restablecerPassword(String token, String nuevaPassword) {
        // Puedes reutilizar tu lógica de activación si valida el token de recuperación,
        // o implementar la búsqueda por tokenRecuperacion:
        Usuario usuario = usuarioRepositoryPort.findByTokenRecuperacion(token)
                .orElseThrow(() -> new RuntimeException("El enlace de recuperación es inválido o ha expirado."));

        // Validar expiración si manejas fecha de expiración del token...

        usuario.setPasswordHash(passwordEncoder.encode(nuevaPassword));
        usuario.setTokenRecuperacion(null);
        usuario.setExpiracionTokenRecuperacion(null);

        usuarioRepositoryPort.guardar(usuario);
    }
}