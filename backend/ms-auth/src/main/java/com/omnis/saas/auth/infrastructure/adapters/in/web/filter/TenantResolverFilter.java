package com.omnis.saas.auth.infrastructure.adapters.in.web.filter;

import com.omnis.saas.auth.domain.model.Colegio;
import com.omnis.saas.auth.domain.ports.out.ColegioRepositoryPort;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class TenantResolverFilter extends OncePerRequestFilter {

    private final ColegioRepositoryPort colegioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. BYPASS CORS: Dejar pasar las peticiones OPTIONS sin restricciones
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();

        // 2. Dejamos pasar libremente las rutas públicas y globales
        if (path != null && (path.contains("/login") ||
                path.contains("/registro") ||
                path.contains("/sistema") ||
                path.contains("/colegios") ||
                path.contains("/usuarios/cambiar-password"))) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extraemos el subdominio
        String subdominio = extraerSubdominio(request);

        if (subdominio != null && !subdominio.equals("www") && !subdominio.equals("admin")) {

            subdominio = subdominio.trim().toLowerCase(); // Limpiamos formato

            Optional<Colegio> colegioOpt = colegioRepository.findBySubdominio(subdominio);

            if (colegioOpt.isPresent()) {
                Colegio colegio = colegioOpt.get();

                if (colegio.getEstado() != null && !colegio.getEstado()) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().write("El servicio para este colegio se encuentra suspendido por falta de pago.");
                    return;
                }

                request.setAttribute("tenant_colegio_id", colegio.getId());

            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write("El subdominio especificado no existe.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extraerSubdominio(HttpServletRequest request) {
        // Soporte para Frontend (React) mediante header
        String headerSubdominio = request.getHeader("X-Subdominio");
        if (headerSubdominio != null && !headerSubdominio.trim().isEmpty()) {
            return headerSubdominio;
        }

        String serverName = request.getServerName();

        // IGNORAR IPS Y LOCALHOST (Evita el bug del '192')
        if (serverName == null ||
                serverName.equals("localhost") ||
                serverName.equals("127.0.0.1") ||
                serverName.matches("^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$")) {
            return null;
        }

        String[] parts = serverName.split("\\.");
        if (parts.length >= 2) {
            return parts[0];
        }
        return null;
    }
}