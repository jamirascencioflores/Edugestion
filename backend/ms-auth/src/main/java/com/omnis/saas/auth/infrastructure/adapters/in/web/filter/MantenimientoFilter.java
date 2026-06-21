package com.omnis.saas.auth.infrastructure.adapters.in.web.filter;

import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.ConfiguracionGlobalEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.ConfiguracionGlobalJpaRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class MantenimientoFilter extends OncePerRequestFilter {

    private final ConfiguracionGlobalJpaRepository configuracionRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // 1. EXCEPCIÓN TOTAL: Si la ruta es de login o de gestión del sistema,
        // pasamos directamente al siguiente filtro sin mirar si hay mantenimiento.
        if (path != null && (path.contains("/api/auth/usuarios/login") ||
                path.contains("/api/auth/sistema/mantenimiento"))) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Para cualquier otra ruta, verificamos el estado del sistema
        ConfiguracionGlobalEntity config = configuracionRepository.obtenerConfiguracion();

        if (config.isModoMantenimiento()) {
            // Recuperamos la autenticación que el JwtAuthenticationFilter ya inyectó
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            boolean isSuperAdmin = auth != null && auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_SUPERADMIN"));

            // 3. BLOQUEO: Si el sistema está en mantenimiento y NO eres SuperAdmin
            if (!isSuperAdmin) {
                response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE); // 503
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write(String.format(
                        "{\"error\": \"MANTENIMIENTO\", \"mensaje\": \"%s\"}",
                        config.getMensajeMantenimiento()
                ));
                return;
            }
        }

        // 4. Si no hay mantenimiento o eres SuperAdmin, adelante
        filterChain.doFilter(request, response);
    }
}