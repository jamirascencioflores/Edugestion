package com.omnis.saas.auth.infrastructure.adapters.in.web;

import com.omnis.saas.auth.domain.model.PlanSaas;
import com.omnis.saas.auth.domain.ports.in.PlanSaaSUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth/superadmin/planes")
@RequiredArgsConstructor
public class PlanSaasController {

    private final PlanSaaSUseCase planSaaSUseCase;

    @GetMapping
    public ResponseEntity<List<PlanSaas>> listarPlanes() {
        return ResponseEntity.ok(planSaaSUseCase.obtenerTodosLosPlanes());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanSaas> actualizarPlan(@PathVariable Long id, @RequestBody PlanSaas plan) {
        return ResponseEntity.ok(planSaaSUseCase.actualizarPlan(id, plan));
    }

    // En tu Controller de ms-auth (ej: PlanSaasController.java)
    @GetMapping("/planes/limite-alumnos")
    public ResponseEntity<Integer> obtenerLimiteAlumnos(@RequestHeader("X-Colegio-Id") Long colegioId) {
        Integer limite = planSaaSUseCase.obtenerLimiteAlumnos(colegioId);
        return ResponseEntity.ok(limite);
    }
}