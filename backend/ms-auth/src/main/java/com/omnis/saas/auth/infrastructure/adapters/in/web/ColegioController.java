package com.omnis.saas.auth.infrastructure.adapters.in.web;

import com.omnis.saas.auth.domain.ports.in.ColegioUseCase;
import com.omnis.saas.auth.domain.ports.in.PlanSaaSUseCase;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.ColegioActualizarDTO;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.ColegioRegistroDTO;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.ColegioResumenDTO;
import com.omnis.saas.auth.domain.model.Colegio;
import com.omnis.saas.auth.infrastructure.adapters.in.web.aop.AuditarAccion; // <-- Importación del espía

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/colegios")
@RequiredArgsConstructor
public class ColegioController {

    private final ColegioUseCase colegioUseCase;
    private final PlanSaaSUseCase planSaaSUseCase;

    @PostMapping
    @AuditarAccion(accion = "CREAR", entidad = "Colegio") // <-- Vigila la creación
    public ResponseEntity<?> registrar(@RequestBody ColegioRegistroDTO dto) {
        try {
            // AHORA RECIBE EL MODELO DE DOMINIO PURO, NO EL ENTITY
            Colegio nuevoColegio = colegioUseCase.registrarNuevoColegio(dto);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "mensaje", "Colegio y Director registrados exitosamente",
                            "colegioId", nuevoColegio.getId(),
                            "subdominio", nuevoColegio.getSubdominio()
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    @GetMapping
    public ResponseEntity<List<ColegioResumenDTO>> listar() {
        return ResponseEntity.ok(colegioUseCase.listarTodos());
    }

    @PutMapping("/{id}")
    @AuditarAccion(accion = "ACTUALIZAR", entidad = "Colegio") // <-- Vigila la edición de datos
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody ColegioActualizarDTO dto) {
        return ResponseEntity.ok(colegioUseCase.actualizarColegio(id, dto));
    }

    @PutMapping("/{id}/estado")
    @AuditarAccion(accion = "CAMBIAR_ESTADO", entidad = "Colegio") // <-- Vigila si lo inactivan/activan
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id) {
        try {
            colegioUseCase.cambiarEstado(id);
            return ResponseEntity.ok(Map.of("mensaje", "Estado actualizado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @AuditarAccion(accion = "ELIMINAR", entidad = "Colegio") // <-- Vigila quién borra un colegio
    public ResponseEntity<?> eliminarColegio(@PathVariable Long id) {
        try {
            colegioUseCase.eliminarColegio(id);
            return ResponseEntity.ok(Map.of("mensaje", "Colegio eliminado definitivamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/validar-subdominio")
    public ResponseEntity<Boolean> validarSubdominio(@RequestParam String subdominio) {
        boolean estaLibre = colegioUseCase.validarSubdominio(subdominio);
        return ResponseEntity.ok(estaLibre);
    }

    // USO: Comunicación entre Microservicios (ms-academico llama a ms-auth)
    @GetMapping("/{id}/limite-alumnos")
    public ResponseEntity<Integer> obtenerLimiteAlumnos(@PathVariable Long id) {
        // Devuelve el número máximo permitido por su plan
        return ResponseEntity.ok(planSaaSUseCase.obtenerLimiteAlumnos(id));
    }
}