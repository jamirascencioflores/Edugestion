package com.omnis.saas.academico.infrastructure.adapters.in.web;

import com.omnis.saas.academico.domain.ports.in.AsignacionUseCase;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.AsignacionActualizarDTO;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.AsignacionRegistroDTO;
import com.omnis.saas.academico.infrastructure.config.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/academicos/asignaciones")
@RequiredArgsConstructor
public class AsignacionController {

    private final AsignacionUseCase service;

    @PostMapping
    public ResponseEntity<?> asignarCurso(@RequestBody AsignacionRegistroDTO dto) {
        Long colegioId = TenantContext.getColegioId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.registrar(dto.toDomain(colegioId)));
    }

    // Útil para que la pantalla en React cargue la tabla filtrando por sección
    @GetMapping("/seccion/{seccionId}")
    public ResponseEntity<?> listarPorSeccion(@PathVariable Long seccionId) {
        return ResponseEntity.ok(service.listarPorSeccion(seccionId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody AsignacionActualizarDTO dto) {
        return ResponseEntity.ok(service.actualizar(id, dto.toDomain()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/docente/{docenteId}")
    public ResponseEntity<?> listarPorDocente(@PathVariable String docenteId) {
        return ResponseEntity.ok(service.listarPorDocente(docenteId));
    }
}