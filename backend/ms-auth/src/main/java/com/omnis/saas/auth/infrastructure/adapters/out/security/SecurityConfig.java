package com.omnis.saas.auth.infrastructure.adapters.out.security;

import com.omnis.saas.auth.infrastructure.adapters.in.web.filter.MantenimientoFilter;
import com.omnis.saas.auth.infrastructure.adapters.in.web.filter.RateLimitingFilter;
import com.omnis.saas.auth.infrastructure.adapters.in.web.filter.TenantResolverFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final TenantResolverFilter tenantResolverFilter;
    private final MantenimientoFilter mantenimientoFilter;
    private final RateLimitingFilter rateLimitingFilter; // 👈 Inyectamos el filtro de Rate Limiting

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/usuarios/registro",
                                "/api/auth/usuarios/login",
                                "/api/auth/usuarios/public/**",
                                "/error"
                        ).permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/auth/docentes/**").hasAnyAuthority("ROLE_ADMIN_COLEGIO", "ROLE_SUPERADMIN")
                        .anyRequest().authenticated()
                )
                // 1. RateLimitingFilter al inicio de la cadena
                .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)
                // 2. TenantResolverFilter después
                .addFilterBefore(tenantResolverFilter, UsernamePasswordAuthenticationFilter.class)
                // 3. Autenticación JWT y Mantenimiento
                .addFilterAfter(jwtAuthFilter, TenantResolverFilter.class)
                .addFilterAfter(mantenimientoFilter, JwtAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}