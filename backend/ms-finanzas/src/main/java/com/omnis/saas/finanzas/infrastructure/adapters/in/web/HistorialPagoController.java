package com.omnis.saas.finanzas.infrastructure.adapters.in.web;

import com.omnis.saas.finanzas.domain.model.HistorialPago;
import com.omnis.saas.finanzas.domain.ports.in.ObtenerHistorialUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finanzas/historial")
@RequiredArgsConstructor
public class HistorialPagoController {

    private final ObtenerHistorialUseCase obtenerHistorialUseCase;

    @GetMapping("/{estudianteId}")
    public ResponseEntity<List<HistorialPago>> obtenerHistorial(@PathVariable Long estudianteId) {
        return ResponseEntity.ok(obtenerHistorialUseCase.ejecutar(estudianteId));
    }
}