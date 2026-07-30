package com.omnis.saas.auth.domain.ports.out;

public interface EmailServicePort {
    void enviarInvitacion(String destinatario, String nombre, String token, String subdominio);
    void enviarCorreoRecuperacion(String destino, String nombre, String token);
}