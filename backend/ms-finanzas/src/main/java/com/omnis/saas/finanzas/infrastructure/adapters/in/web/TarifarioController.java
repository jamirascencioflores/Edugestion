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

    public record TarifarioRequest(Long gradoId, java.math.BigDecimal montoMensual, Integer anioEscolar, String tipoTarifa) {}

    @PostMapping
    public ResponseEntity<Tarifario> crear(@RequestHeader("X-Colegio-Id") Long colegioId,
                                           @RequestBody TarifarioRequest request) {
        Tarifario tarifario = Tarifario.builder()
                .colegioId(colegioId)
                .gradoId(request.gradoId())
                .montoMensual(request.montoMensual())
                .anioEscolar(request.anioEscolar())
                .tipoTarifa(request.tipoTarifa())
                .build();
        return ResponseEntity.ok(useCase.crearTarifario(tarifario));
    }

    @GetMapping("/anio/{anioEscolar}")
    public ResponseEntity<List<Tarifario>> obtenerPorAnio(@RequestHeader("X-Colegio-Id") Long colegioId,
                                                          @PathVariable Integer anioEscolar) {
        return ResponseEntity.ok(useCase.obtenerPorAnio(colegioId, anioEscolar));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarifario> actualizar(@RequestHeader("X-Colegio-Id") Long colegioId,
                                                @PathVariable Long id,
                                                @RequestBody TarifarioRequest request) {
        Tarifario tarifario = Tarifario.builder()
                .gradoId(request.gradoId())
                .montoMensual(request.montoMensual())
                .anioEscolar(request.anioEscolar())
                .tipoTarifa(request.tipoTarifa())
                .build();
        return ResponseEntity.ok(useCase.actualizarTarifario(id, colegioId, tarifario));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Void> cambiarEstado(@RequestHeader("X-Colegio-Id") Long colegioId,
                                              @PathVariable Long id,
                                              @RequestParam Boolean estado) {
        useCase.cambiarEstado(id, colegioId, estado);
        return ResponseEntity.noContent().build();
    }
}