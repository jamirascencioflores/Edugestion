package com.omnis.saas.auth.infrastructure.adapters.in.web.aop;

import com.omnis.saas.auth.domain.model.Colegio;
import com.omnis.saas.auth.domain.model.PlanSaas;
import com.omnis.saas.auth.domain.ports.out.ColegioRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class FeatureValidatorAspect {

    private final ColegioRepositoryPort colegioRepository;

    @Before("@annotation(requiereFeature)")
    public void validarAcceso(RequiereFeature requiereFeature) {
        // 1. Obtenemos el ID del colegio desde el token JWT (Contexto de Seguridad)
        // Nota: Ajusta esto si guardas el ID del colegio en el principal de otra forma
        String emailUsuario = SecurityContextHolder.getContext().getAuthentication().getName();

        // Buscamos el colegio vinculado (simplificado, puedes usar UsuarioRepositoryPort aquí si prefieres)
        // Para este ejemplo asumiremos que tienes un método rápido para sacar el colegio.
        // Si tu token ya expone el colegioId, sácalo directo de ahí.

        // Simulación:
        Long colegioId = extraerColegioIdDelTokenContexto();

        Colegio colegio = colegioRepository.findById(colegioId)
                .orElseThrow(() -> new RuntimeException("Colegio no encontrado"));

        PlanSaas plan = colegio.getPlan();
        String feature = requiereFeature.value();

        // 2. Validamos según el feature solicitado
        boolean autorizado = switch (feature) {
            case "PORTAL_PADRES" -> plan.getPermitePortalPadres();
            case "REPORTES_PDF" -> plan.getPermiteReportesPdf();
            case "NOTIFICACIONES" -> plan.getPermiteNotificaciones();
            case "MARCA_BLANCA" -> plan.getPermiteMarcaBlanca();
            case "FINANZAS_PRO" -> plan.getPermiteFinanzasPro();
            default -> false;
        };

        // 3. Bloqueamos si no tiene el flag en true
        if (!autorizado) {
            throw new RuntimeException("Tu plan actual no permite el uso de: " + feature + ". Por favor mejora tu suscripción.");
        }
    }

    // Método de apoyo para extraer el colegioId (dependerá de tu JwtFilter)
    private Long extraerColegioIdDelTokenContexto() {
        // Si tu JwtFilter guarda un CustomUserDetails con el colegioId, sácalo aquí.
        // Ejemplo: return ((CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getColegioId();
        return 1L; // Placeholder temporal
    }
}