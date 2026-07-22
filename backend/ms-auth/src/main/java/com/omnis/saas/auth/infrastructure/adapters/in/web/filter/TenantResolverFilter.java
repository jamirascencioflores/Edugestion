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
        log.info("URI solicitada: {} | ServerName: {} | Header X-Subdominio: {}", request.getRequestURI(), request.getServerName(), request.getHeader("X-Subdominio"));

        // 1. BYPASS CORS: Dejar pasar las peticiones OPTIONS sin restricciones
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();

        // 2. Dejamos pasar libremente solo las rutas estrictamente públicas de auth
        if (path != null && (path.equals("/api/auth/login") ||
                path.contains("/registro") ||
                path.contains("/sistema/mantenimiento"))) {
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

        // ENTORNO LOCAL / IP: Forzamos el subdominio de prueba para que no falle al desarrollar
        if (serverName == null ||
                serverName.equals("localhost") ||
                serverName.equals("127.0.0.1") ||
                serverName.matches("^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$")) {
            return "sanpedro"; // <-- Forzamos el colegio de prueba por defecto en desarrollo
        }

        String[] parts = serverName.split("\\.");
        if (parts.length >= 2) {
            return parts[0];
        }
        return null;
    }
}