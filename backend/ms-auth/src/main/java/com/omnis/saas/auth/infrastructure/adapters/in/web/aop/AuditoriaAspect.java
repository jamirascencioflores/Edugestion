package com.omnis.saas.auth.infrastructure.adapters.in.web.aop;

import com.omnis.saas.auth.domain.model.LogAuditoria;
import com.omnis.saas.auth.domain.ports.out.LogAuditoriaRepositoryPort;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.Arrays;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class AuditoriaAspect {

    private final LogAuditoriaRepositoryPort logAuditoriaPort;

    // Se ejecuta DESPUÉS de que el método etiquetado termine exitosamente
    @AfterReturning("@annotation(auditarAccion)")
    public void registrarLog(JoinPoint joinPoint, AuditarAccion auditarAccion) {
        try {
            // 1. Capturamos el Request actual
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes == null) return;
            HttpServletRequest request = attributes.getRequest();

            // 2. ¿Quién lo hizo?
            String usuario = "SISTEMA";
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
                usuario = auth.getName();
            }

            // 3. ¿De qué colegio es? (Extraído de tu TenantResolverFilter)
            Long colegioId = null;
            Object tenantIdAttr = request.getAttribute("tenant_colegio_id");
            if (tenantIdAttr != null) {
                colegioId = (Long) tenantIdAttr;
            }

            // 4. ¿Desde qué IP?
            String ip = request.getHeader("X-Forwarded-For");
            if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getRemoteAddr();
            }

            // 5. ¿Qué modificó exactamente? (Nombre del método y parámetros)
            String detalle = String.format("Método: %s | Datos: %s",
                    joinPoint.getSignature().getName(),
                    Arrays.toString(joinPoint.getArgs()));

            // 6. Guardamos en BD
            LogAuditoria logAuditoria = LogAuditoria.builder()
                    .colegioId(colegioId)
                    .usuarioEmail(usuario)
                    .accion(auditarAccion.accion())
                    .entidad(auditarAccion.entidad())
                    .detalle(detalle)
                    .ipOrigen(ip)
                    .fechaHora(LocalDateTime.now())
                    .build();

            logAuditoriaPort.guardar(logAuditoria);

        } catch (Exception e) {
            log.error("Error al registrar auditoría: {}", e.getMessage());
        }
    }
}