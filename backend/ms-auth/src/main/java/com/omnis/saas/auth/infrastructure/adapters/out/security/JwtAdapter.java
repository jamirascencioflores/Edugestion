package com.omnis.saas.auth.infrastructure.adapters.out.security;

import com.omnis.saas.auth.domain.model.Usuario;
import com.omnis.saas.auth.domain.ports.out.TokenProviderPort;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtAdapter implements TokenProviderPort {

    private final String SECRET = "EstaEsUnaClaveSecretaMuyLargaYSeguraParaOmnisSaaS2026!";
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());

    @Override
    public String generarToken(Usuario usuario) {
        String nombreMostrar = (usuario.getNombreCompleto() != null && !usuario.getNombreCompleto().isEmpty())
                ? usuario.getNombreCompleto()
                : "Administrador";

        // Verificamos de forma segura si el colegio existe para evitar NullPointerException
        Long colegioId = null;
        String nombreColegio = null;

        if (usuario.getColegio() != null) {
            colegioId = usuario.getColegio().getId();
            nombreColegio = usuario.getColegio().getNombre();
        }

        return Jwts.builder()
                .subject(usuario.getEmail())
                .claim("userId", usuario.getId())
                .claim("nombre", nombreMostrar)
                .claim("rol", usuario.getRol().getNombre()) // <-- Ahora usa el dominio puro
                .claim("colegioId", colegioId)
                .claim("nombreColegio", nombreColegio)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(key)
                .compact();
    }

    // --- MÉTODOS PARA LEER EL TOKEN EN EL FILTRO ---

    public String extraerEmail(String token) {
        return extraerTodasLasClaims(token).getSubject();
    }

    public Long extraerColegioId(String token) {
        return extraerTodasLasClaims(token).get("colegioId", Long.class);
    }

    public boolean validarToken(String token) {
        try {
            extraerTodasLasClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims extraerTodasLasClaims(String token) {
        return Jwts.parser()
                .verifyWith(key) // Reemplaza a setSigningKey
                .build()
                .parseSignedClaims(token) // Reemplaza a parseClaimsJws
                .getPayload(); // Reemplaza a getBody
    }
}