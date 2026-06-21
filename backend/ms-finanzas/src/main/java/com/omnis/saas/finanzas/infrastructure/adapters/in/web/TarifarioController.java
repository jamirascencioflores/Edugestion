package com.omnis.saas.finanzas.infrastructure.adapters.in.web;

import com.omnis.saas.finanzas.domain.model.Tarifario;
import com.omnis.saas.finanzas.domain.ports.in.TarifarioUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/finanzas/tarifarios")
@RequiredArgsConstructor
public class TarifarioController {

    private final TarifarioUseCase useCase;

    @PostMapping
    public ResponseEntity<Tarifario> crear(@RequestHeader("X-Colegio-Id") Long colegioId,
                                           @RequestBody Tarifario tarifario) {
        tarifario.setColegioId(colegioId);
        return ResponseEntity.ok(useCase.crearTarifario(tarifario));
    }

    @GetMapping("/anio/{anioEscolar}")
    public ResponseEntity<List<Tarifario>> obtenerPorAnio(@RequestHeader("X-Colegio-Id") Long colegioId,
                                                          @PathVariable Integer anioEscolar) {
        return ResponseEntity.ok(useCase.obtenerPorAnio(colegioId, anioEscolar));
    }
}