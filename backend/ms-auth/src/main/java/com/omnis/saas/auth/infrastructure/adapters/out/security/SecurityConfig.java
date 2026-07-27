package com.omnis.saas.auth.infrastructure.adapters.out.security;

import com.omnis.saas.auth.infrastructure.adapters.in.web.filter.TenantResolverFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.omnis.saas.auth.infrastructure.adapters.in.web.filter.MantenimientoFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final TenantResolverFilter tenantResolverFilter;
    private final MantenimientoFilter mantenimientoFilter;

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
                .addFilterBefore(tenantResolverFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(jwtAuthFilter, TenantResolverFilter.class)
                .addFilterAfter(mantenimientoFilter, JwtAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}