package com.omnis.saas.academico.infrastructure.adapters.in.web;

import com.omnis.saas.academico.domain.ports.in.CursoUseCase;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.CursoActualizarDTO;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.CursoRegistroDTO;
import com.omnis.saas.academico.infrastructure.config.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/academicos/cursos")
@RequiredArgsConstructor
public class CursoController {
    private final CursoUseCase service;

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody CursoRegistroDTO dto) {
        Long colegioId = TenantContext.getColegioId();
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registrar(dto.toDomain(colegioId)));
    }
    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody CursoActualizarDTO dto) {
        return ResponseEntity.ok(service.actualizar(id, dto.toDomain()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}