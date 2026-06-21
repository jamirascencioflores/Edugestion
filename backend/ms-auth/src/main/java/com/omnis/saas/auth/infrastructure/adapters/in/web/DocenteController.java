package com.omnis.saas.auth.infrastructure.adapters.in.web;

import com.omnis.saas.auth.domain.ports.in.DocenteUseCase;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.DocenteActualizarDTO;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.DocenteRegistroDTO;
import com.omnis.saas.auth.infrastructure.adapters.in.web.aop.AuditarAccion; // <-- Importación del espía
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.DocenteResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth/docentes")
@RequiredArgsConstructor
public class DocenteController {

    private final DocenteUseCase docenteUseCase;

    @PostMapping
    @AuditarAccion(accion = "CREAR", entidad = "Docente") // <-- Vigila la creación
    public ResponseEntity<?> registrar(
            @RequestBody DocenteRegistroDTO dto,
            @RequestAttribute("tenant_colegio_id") Long colegioId) {

        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(docenteUseCase.registrarDocente(dto, colegioId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listar(@RequestAttribute("tenant_colegio_id") Long colegioId) {
        List<DocenteResponseDTO> dtos = docenteUseCase.listarPorColegio(colegioId).stream()
                .map(d -> new DocenteResponseDTO(
                        d.getId(),
                        d.getNombres(),
                        d.getApellidos(),
                        d.getDocumentoIdentidad(),
                        d.getEmail(),
                        d.getEspecialidad(),
                        d.getEstado(),
                        d.getUsuario() != null ? d.getUsuario().getId().toString() : null
                )).toList();

        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    @AuditarAccion(accion = "ACTUALIZAR", entidad = "Docente")
    public ResponseEntity<?> actualizar(
            @PathVariable Long id,
            @RequestBody DocenteActualizarDTO dto,
            @RequestAttribute("tenant_colegio_id") Long colegioId) {
        try {
            return ResponseEntity.ok(docenteUseCase.actualizarDocente(id, dto, colegioId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @AuditarAccion(accion = "ELIMINAR", entidad = "Docente")
    public ResponseEntity<?> eliminar(
            @PathVariable Long id,
            @RequestAttribute("tenant_colegio_id") Long colegioId) {
        try {
            docenteUseCase.eliminarDocente(id, colegioId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}