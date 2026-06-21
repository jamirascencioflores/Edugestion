package com.omnis.saas.academico.infrastructure.adapters.in.web;

import com.omnis.saas.academico.domain.model.Periodo;
import com.omnis.saas.academico.domain.ports.in.PeriodoUseCase;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.PeriodoActualizarDTO;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.PeriodoRegistroDTO;
import com.omnis.saas.academico.infrastructure.config.tenant.TenantContext;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/academicos/periodos")
@RequiredArgsConstructor
public class PeriodoController {

    private final PeriodoUseCase periodoUseCase;

    @PostMapping
    public ResponseEntity<?> crearPeriodo(@RequestBody PeriodoRegistroDTO dto) {
        // 1. Conservamos tu try-catch para los errores
        try {
            // 2. Extraemos el ID del contexto (ya no necesitamos el HttpServletRequest)
            Long colegioId = TenantContext.getColegioId();

            // 3. Usamos el nombre de tu variable (periodoUseCase)
            Periodo nuevoPeriodo = periodoUseCase.registrarPeriodo(dto.toDomain(colegioId));

            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPeriodo);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> listarPeriodos() {
        // MAGIA AOP: Ya no pedimos el colegioId ni el request.
        // Solo llamamos a listar() y la base de datos se encarga de filtrar.
        return ResponseEntity.ok(periodoUseCase.listar());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody PeriodoActualizarDTO dto) {
        // Asegúrate de inyectar el colegioId al DTO igual que en el POST
        Long colegioId = TenantContext.getColegioId();
        return ResponseEntity.ok(periodoUseCase.actualizar(id, dto.toDomain(colegioId)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        periodoUseCase.eliminar(id);
        return ResponseEntity.noContent().build(); // Devuelve un 204
    }
}