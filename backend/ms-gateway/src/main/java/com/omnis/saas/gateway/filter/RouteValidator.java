package com.omnis.saas.gateway.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    // Lista de rutas que NO requieren token
    public static final List<String> openApiEndpoints = List.of(
            "/api/auth/usuarios/registro",
            "/api/auth/usuarios/login",
            "/api/auth/usuarios/public" // <-- ¡Añade esta línea!
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));
}