package com.omnis.saas.academico.infrastructure.adapters.in.web;

import com.omnis.saas.academico.domain.ports.in.EstudianteUseCase;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.EstudianteActualizarDTO;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.EstudianteRegistroDTO;
import com.omnis.saas.academico.infrastructure.config.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/academicos/estudiantes")
@RequiredArgsConstructor
public class EstudianteController {
    private final EstudianteUseCase service;

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody EstudianteRegistroDTO dto) {
        Long colegioId = TenantContext.getColegioId();
        return ResponseEntity.status(HttpStatus.CREATED).body(
                service.registrar(dto.toDomain(colegioId), dto.gradoId(), dto.anioEscolar(), dto.fechaInscripcion())
        );
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody EstudianteActualizarDTO dto) {
        Long colegioId = TenantContext.getColegioId();
        return ResponseEntity.ok(service.actualizar(id, dto, colegioId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        Long colegioId = TenantContext.getColegioId();
        service.eliminar(id, colegioId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/seccion/{seccionId}")
    public ResponseEntity<?> listarPorSeccion(@PathVariable Long seccionId) {
        return ResponseEntity.ok(service.listarPorSeccion(seccionId));
    }

    // 👇 NUEVO ENDPOINT PARA FEIGN
    @GetMapping("/{id}/nombre")
    public ResponseEntity<String> obtenerNombreEstudiante(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id).getNombreCompleto());
    }
}