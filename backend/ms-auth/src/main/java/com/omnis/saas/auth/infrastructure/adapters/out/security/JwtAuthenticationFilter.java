package com.omnis.saas.auth.infrastructure.adapters.out.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtAdapter jwtAdapter;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtAdapter jwtAdapter, @Lazy UserDetailsService userDetailsService) {
        this.jwtAdapter = jwtAdapter;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.contains("/public/")
                || path.contains("/login")
                || path.contains("/registro")
                || path.equals("/error");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);

        if (jwtAdapter.validarToken(jwt)) {
            String userEmail = jwtAdapter.extraerEmail(jwt);
            Long tokenColegioId = jwtAdapter.extraerColegioId(jwt);
            Long urlColegioId = (Long) request.getAttribute("tenant_colegio_id");

            if (urlColegioId == null && tokenColegioId != null) {
                request.setAttribute("tenant_colegio_id", tokenColegioId);
                urlColegioId = tokenColegioId;
            }

            if (tokenColegioId != null && urlColegioId != null && !tokenColegioId.equals(urlColegioId)) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write("Acceso denegado: El token no pertenece a este colegio.");
                return;
            }

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);

                if (tokenColegioId != null && urlColegioId == null) {
                    request.setAttribute("tenant_colegio_id", tokenColegioId);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}