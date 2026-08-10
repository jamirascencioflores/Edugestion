package com.omnis.saas.academico.infrastructure.adapters.in.web;

import com.omnis.saas.academico.domain.ports.in.SeccionUseCase;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.SeccionActualizarDTO;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.SeccionRegistroDTO;
import com.omnis.saas.academico.infrastructure.config.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/academicos/secciones")
@RequiredArgsConstructor
public class SeccionController {

    private final SeccionUseCase service;

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody SeccionRegistroDTO dto) {
        Long colegioId = TenantContext.getColegioId();
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registrar(dto.toDomain(colegioId)));
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody SeccionActualizarDTO dto) {
        Long colegioId = TenantContext.getColegioId();
        return ResponseEntity.ok(service.actualizar(id, dto, colegioId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        Long colegioId = TenantContext.getColegioId();
        service.eliminar(id, colegioId);
        return ResponseEntity.noContent().build();
    }
}