package com.omnis.saas.academico.infrastructure.config.tenant;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class TenantFilter implements Filter {

    private static final String TENANT_HEADER = "X-Colegio-Id";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        String tenantHeader = req.getHeader(TENANT_HEADER);

        try {
            if (tenantHeader != null && !tenantHeader.isEmpty()) {
                TenantContext.setColegioId(Long.valueOf(tenantHeader));
            } else {
                // Si no hay header, podríamos lanzar una excepción o dejarlo nulo (depende de tus reglas)
                // Para pruebas, podríamos lanzar un error 400 Bad Request
                HttpServletResponse res = (HttpServletResponse) response;
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                res.getWriter().write("Falta el Header X-Colegio-Id");
                return;
            }

            // Continúa con la ejecución normal hacia el Controlador
            chain.doFilter(request, response);

        } finally {
            // MUY IMPORTANTE: Limpiar el contexto para evitar fugas de memoria
            // y que los datos no se mezclen en la siguiente petición.
            TenantContext.clear();
        }
    }
}