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

            String urlActivacion = "http://localhost:5173/setup-password?token=" + token;

            String html = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                        <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">EduGestión</h1>
                        </div>
                        <div style="padding: 30px; background-color: #ffffff; color: #333333;">
                            <h2 style="margin-top: 0;">Hola, %s</h2>
                            <p style="font-size: 16px; line-height: 1.5;">Has sido registrado en nuestra plataforma. Para completar tu configuración y acceder a tu panel, por favor establece tu contraseña haciendo clic en el botón de abajo:</p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="%s" style="background-color: #4F46E5; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Configurar mi cuenta</a>
                            </div>
                            
                            <p style="font-size: 14px; color: #666666; margin-bottom: 0;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                            <p style="font-size: 14px; color: #4F46E5; word-break: break-all;">%s</p>
                        </div>
                    </div>
                    """.formatted(nombre, urlActivacion, urlActivacion);

            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Error al enviar el correo: " + e.getMessage());
        }
    }

    @Override
    public void enviarCorreoRecuperacion(String destinatario, String nombre, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(destinatario);
            helper.setSubject("Recuperación de Contraseña - EduGestión");

            // Asegúrate de que esta ruta coincida con la de tu frontend para restablecer contraseñas
            String urlRecuperacion = "http://localhost:5173/reset-password?token=" + token;

            String html = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                        <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">EduGestión</h1>
                        </div>
                        <div style="padding: 30px; background-color: #ffffff; color: #333333;">
                            <h2 style="margin-top: 0;">Hola, %s</h2>
                            <p style="font-size: 16px; line-height: 1.5;">Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva:</p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="%s" style="background-color: #4F46E5; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Restablecer Contraseña</a>
                            </div>
                            
                            <p style="font-size: 14px; color: #666666; margin-bottom: 0;">Si no solicitaste este cambio, puedes ignorar este correo. Por seguridad, el enlace caducará en 15 minutos.</p>
                            <br>
                            <p style="font-size: 14px; color: #666666; margin-bottom: 0;">Si el botón no funciona, copia y pega este enlace:</p>
                            <p style="font-size: 14px; color: #4F46E5; word-break: break-all;">%s</p>
                        </div>
                    </div>
                    """.formatted(nombre, urlRecuperacion, urlRecuperacion);

            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Error al enviar el correo de recuperación: " + e.getMessage());
        }
    }
}