package com.omnis.saas.finanzas.infrastructure.adapters.in.web;

import com.omnis.saas.finanzas.domain.model.Deuda;
import com.omnis.saas.finanzas.domain.ports.in.DeudaUseCase;
import com.omnis.saas.finanzas.domain.ports.in.GenerarDeudasEstudianteUseCase; // 👈 1. Importar el nuevo caso de uso
import com.omnis.saas.finanzas.infrastructure.adapters.in.web.dto.DeudaResponseDTO;
import com.omnis.saas.finanzas.infrastructure.adapters.in.web.dto.PagoRequest;
import com.omnis.saas.finanzas.infrastructure.adapters.in.web.dto.ReversionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/finanzas/deudas")
@RequiredArgsConstructor
public class DeudaController {

    private final DeudaUseCase deudaUseCase;
    private final GenerarDeudasEstudianteUseCase generarDeudasEstudianteUseCase; // 👈 2. Inyectar la interfaz

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

    // 3. Endpoint actualizado para cobrar con Método de Pago y N° de Operación
    @PutMapping("/{id}/pagar")
    public ResponseEntity<Void> pagarDeuda(
            @PathVariable Long id,
            @RequestBody(required = false) PagoRequest request) {

        String metodoPago = (request != null && request.metodoPago() != null) ? request.metodoPago() : "Efectivo";
        String numeroOp = (request != null) ? request.numeroOperacion() : null;

        deudaUseCase.pagarDeuda(id, metodoPago, numeroOp);
        return ResponseEntity.ok().build();
    }

    // 4. Endpoint para revertir
    @PutMapping("/{id}/revertir")
    public ResponseEntity<Void> revertirPago(
            @PathVariable Long id,
            @RequestBody ReversionRequest request) {

        deudaUseCase.revertirPago(id, request.motivo());
        return ResponseEntity.ok().build();
    }

    // 👈 3. NUEVO ENDPOINT PARA GENERACIÓN AUTOMÁTICA DE CRONOGRAMA
    @PostMapping("/generar-cronograma")
    public ResponseEntity<Void> generarCronograma(
            @RequestHeader("X-Colegio-Id") Long colegioId,
            @RequestParam("estudianteId") Long estudianteId,
            @RequestParam("gradoId") Long gradoId,
            @RequestParam(value = "anioEscolar", defaultValue = "2026") Integer anioEscolar) {

        generarDeudasEstudianteUseCase.generarPensionesAnuales(
                colegioId,
                estudianteId,
                gradoId,
                anioEscolar,
                LocalDate.now()
        );
        return ResponseEntity.ok().build();
    }
}