package com.omnis.saas.academico.infrastructure.adapters.in.web;

import com.omnis.saas.academico.domain.model.Grado;
import com.omnis.saas.academico.domain.ports.in.GradoUseCase;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.GradoActualizarDTO;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.GradoRegistroDTO;
import com.omnis.saas.academico.infrastructure.config.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/academicos/grados")
@RequiredArgsConstructor
public class GradoController {

    private final GradoUseCase service;

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody GradoRegistroDTO dto) {
        Long colegioId = TenantContext.getColegioId();
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registrar(dto.toDomain(colegioId)));
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody GradoActualizarDTO dto) {
        Long colegioId = TenantContext.getColegioId();
        // Pasamos los 3 parámetros que tu UseCase exige
        return ResponseEntity.ok(service.actualizar(id, dto, colegioId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        Long colegioId = TenantContext.getColegioId();
        service.eliminar(id, colegioId);
        return ResponseEntity.noContent().build();
    }
}