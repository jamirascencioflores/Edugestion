package com.omnis.saas.auth.domain.ports.out;

public interface EmailServicePort {
    void enviarInvitacion(String destinatario, String nombre, String token);
}