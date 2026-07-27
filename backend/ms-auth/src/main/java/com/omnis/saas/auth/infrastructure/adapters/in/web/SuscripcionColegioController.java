package com.omnis.saas.auth.infrastructure.adapters.in.web;

import com.omnis.saas.auth.domain.model.SuscripcionColegio;
import com.omnis.saas.auth.domain.ports.in.SuscripcionColegioUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth/superadmin/suscripciones")
@RequiredArgsConstructor
public class SuscripcionColegioController {

    private final SuscripcionColegioUseCase suscripcionUseCase;

    @GetMapping
    public ResponseEntity<List<SuscripcionColegio>> listarTodas() {
        return ResponseEntity.ok(suscripcionUseCase.obtenerTodasLasSuscripciones());
    }

    @PutMapping("/colegio/{colegioId}")
    public ResponseEntity<SuscripcionColegio> actualizarSuscripcion(
            @PathVariable Long colegioId,
            @RequestBody SuscripcionColegio suscripcion) {
        return ResponseEntity.ok(suscripcionUseCase.actualizarSuscripcion(colegioId, suscripcion));
    }
}