package com.omnis.saas.finanzas.infrastructure.adapters.in.web;

import com.omnis.saas.finanzas.domain.model.Deuda;
import com.omnis.saas.finanzas.domain.ports.in.DeudaUseCase;
import com.omnis.saas.finanzas.infrastructure.adapters.in.web.dto.DeudaResponseDTO;
import com.omnis.saas.finanzas.infrastructure.adapters.in.web.dto.PagoRequest;
import com.omnis.saas.finanzas.infrastructure.adapters.in.web.dto.ReversionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finanzas/deudas")
@RequiredArgsConstructor
public class DeudaController {

    private final DeudaUseCase deudaUseCase;

    // 1. Listar deudas de un estudiante específico
    @GetMapping("/estudiante/{estudianteId}")
    public ResponseEntity<List<DeudaResponseDTO>> obtenerDeudasPorEstudiante(
            @RequestHeader("X-Colegio-Id") Long colegioId,
            @PathVariable Long estudianteId) {

        List<Deuda> deudas = deudaUseCase.obtenerPorEstudiante(colegioId, estudianteId);

        List<DeudaResponseDTO> response = deudas.stream()
                .map(d -> new DeudaResponseDTO(
                        d.getId(),
                        d.getConcepto(),
                        d.getMonto(),
                        d.getFechaVencimiento(),
                        d.getEstado().name()
                ))
                .toList();

        return ResponseEntity.ok(response);
    }

    // 2. Anular una deuda (Eliminación Lógica)
    @PutMapping("/{id}/anular")
    public ResponseEntity<Void> anularDeuda(
            @RequestHeader("X-Colegio-Id") Long colegioId,
            @PathVariable Long id) {

        deudaUseCase.anularDeuda(colegioId, id);
        return ResponseEntity.noContent().build();
    }

    // 1. Endpoint actualizado para cobrar
    @PutMapping("/{id}/pagar")
    public ResponseEntity<Void> pagarDeuda(@PathVariable Long id, @RequestBody(required = false) PagoRequest request) {
        String numeroOp = (request != null) ? request.numeroOperacion() : null;
        deudaUseCase.pagarDeuda(id, numeroOp);
        return ResponseEntity.ok().build();
    }

    // 2. Nuevo endpoint para revertir
    @PutMapping("/{id}/revertir")
    public ResponseEntity<Void> revertirPago(@PathVariable Long id, @RequestBody ReversionRequest request) {
        deudaUseCase.revertirPago(id, request.motivo());
        return ResponseEntity.ok().build();
    }
}