package com.omnis.saas.auth.domain.ports.in;

import com.omnis.saas.auth.domain.model.Usuario;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.AuthResponseDTO;

public interface UsuarioUseCase {
    Usuario registrarNuevoUsuario(Usuario usuario, String nombreRol);
    Usuario obtenerUsuarioPorEmail(String email);
    AuthResponseDTO login(String email, String password, Long colegioId);
    void cambiarPassword(String email, String actualPassword, String nuevaPassword);
    void activarCuentaConToken(String token, String nuevaPassword);
    void solicitarRecuperacionPassword(String email);
    void restablecerPassword(String token, String nuevaPassword); // <--- Añade esto
}