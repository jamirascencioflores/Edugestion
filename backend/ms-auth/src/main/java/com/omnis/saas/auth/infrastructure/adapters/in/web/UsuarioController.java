package com.omnis.saas.auth.infrastructure.adapters.in.web;

import com.omnis.saas.auth.domain.model.Usuario;
import com.omnis.saas.auth.domain.ports.in.UsuarioUseCase;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.AuthResponseDTO;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.CambiarPasswordRequestDTO;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.UsuarioRegistroDTO;
import com.omnis.saas.auth.infrastructure.adapters.in.web.aop.AuditarAccion; // <-- Importación del espía
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.LoginRequestDTO;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioUseCase usuarioUseCase;

    @PostMapping("/registro")
    @AuditarAccion(accion = "CREAR", entidad = "Usuario") // <-- Vigila la creación
    public ResponseEntity<?> registrarUsuario(@RequestBody UsuarioRegistroDTO dto) {
        try {
            // 1. Usamos toDomain() y recibimos el Usuario del dominio puro
            Usuario nuevoUsuario = usuarioUseCase.registrarNuevoUsuario(dto.toDomain());

            // 2. Retornamos los datos del nuevo usuario
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
            jakarta.servlet.http.HttpServletRequest request // <-- 1. Agregamos el request
    ) {
        try {
            // 2. Extraemos el colegio (puede ser null si es el admin de sistema)
            Long colegioId = (Long) request.getAttribute("tenant_colegio_id");

            // 3. Le enviamos el colegioId al caso de uso
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
    @AuditarAccion(accion = "ACTUALIZAR_PASSWORD", entidad = "Usuario") // <-- Vigila el cambio de clave
    public ResponseEntity<?> cambiarPassword(
            @RequestBody CambiarPasswordRequestDTO dto,
            org.springframework.security.core.Authentication authentication
    ) {
        try {
            // Extraemos el correo del usuario logueado directamente del token
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
}