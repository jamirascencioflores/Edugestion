package com.omnis.saas.auth.infrastructure.adapters.in.web;

import com.omnis.saas.auth.domain.model.Usuario;
import com.omnis.saas.auth.domain.ports.in.UsuarioUseCase;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.*;
import com.omnis.saas.auth.infrastructure.adapters.in.web.aop.AuditarAccion;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioUseCase usuarioUseCase;

    @PostMapping("/registro")
    @AuditarAccion(accion = "CREAR", entidad = "Usuario")
    public ResponseEntity<?> registrarUsuario(@RequestBody UsuarioRegistroDTO dto) {
        try {
            // Le pasamos el rol que viene desde el frontend dinámicamente
            Usuario nuevoUsuario = usuarioUseCase.registrarNuevoUsuario(dto.toDomain(), dto.rol());

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "mensaje", "Usuario registrado exitosamente",
                            "id", nuevoUsuario.getId(),
                            "email", nuevoUsuario.getEmail()
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequestDTO dto,
            jakarta.servlet.http.HttpServletRequest request
    ) {
        try {
            Long colegioId = (Long) request.getAttribute("tenant_colegio_id");
            AuthResponseDTO response = usuarioUseCase.login(dto.email(), dto.password(), colegioId);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerPerfilProtegido() {
        return ResponseEntity.ok(
                java.util.Map.of(
                        "mensaje", "¡Bienvenido a la zona VIP! Tu token es válido y el Gateway te dejó pasar."
                )
        );
    }

    @PutMapping("/cambiar-password")
    @AuditarAccion(accion = "ACTUALIZAR_PASSWORD", entidad = "Usuario")
    public ResponseEntity<?> cambiarPassword(
            @RequestBody CambiarPasswordRequestDTO dto,
            org.springframework.security.core.Authentication authentication
    ) {
        try {
            String email = authentication.getName();
            usuarioUseCase.cambiarPassword(email, dto.nuevaPassword());

            return ResponseEntity.ok(
                    java.util.Map.of("mensaje", "Contraseña actualizada exitosamente")
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of("error", e.getMessage())
            );
        }
    }

    @PostMapping("/public/activar-cuenta")
    public ResponseEntity<?> activarCuentaPorEmail(@RequestBody ActivarCuentaRequestDTO dto) {
        try {
            usuarioUseCase.activarCuentaConToken(dto.token(), dto.nuevaPassword());

            return ResponseEntity.ok(
                    Map.of("mensaje", "Cuenta activada y contraseña configurada exitosamente")
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    @PostMapping("/public/recuperar-password")
    public ResponseEntity<?> solicitarRecuperacionPassword(@RequestBody RecuperarPasswordRequestDTO dto) {
        System.out.println(">>> SÍ ENTRÓ AL CONTROLLER CON EL CORREO: " + dto.email());
        try {
            usuarioUseCase.solicitarRecuperacionPassword(dto.email());
            return ResponseEntity.ok(
                    java.util.Map.of("mensaje", "Si el correo existe, se enviará un enlace de recuperación.")
            );
        } catch (RuntimeException e) {
            System.out.println(">>> ERROR AL ENVIAR CORREO: " + e.getMessage());
            return ResponseEntity.badRequest().body(
                    java.util.Map.of("error", e.getMessage())
            );
        }
    }

    @PostMapping("/public/restablecer-password")
    public ResponseEntity<?> restablecerPassword(@RequestBody RestablecerPasswordRequestDTO dto) {
        try {
            usuarioUseCase.restablecerPassword(dto.token(), dto.nuevaPassword());

            return ResponseEntity.ok(
                    Map.of("mensaje", "Contraseña restablecida exitosamente")
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }
}