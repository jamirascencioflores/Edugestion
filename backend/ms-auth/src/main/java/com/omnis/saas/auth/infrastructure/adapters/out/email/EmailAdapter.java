package com.omnis.saas.auth.infrastructure.adapters.out.email;

import com.omnis.saas.auth.domain.ports.out.EmailServicePort;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import jakarta.mail.internet.MimeMessage;

@Component
@RequiredArgsConstructor
public class EmailAdapter implements EmailServicePort {

    private final JavaMailSender mailSender;

    @Override
    public void enviarInvitacion(String destinatario, String nombre, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(destinatario);
            helper.setSubject("Bienvenido a EduGestión - Activa tu cuenta");

            String html = "<h1>Hola, " + nombre + "</h1>" +
                    "<p>Has sido registrado como Director. Haz clic abajo para crear tu contraseña:</p>" +
                    "<a href='http://localhost:5173/setup-password?token=" + token + "'>Configurar mi cuenta</a>";

            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Error al enviar el correo: " + e.getMessage());
        }
    }
}