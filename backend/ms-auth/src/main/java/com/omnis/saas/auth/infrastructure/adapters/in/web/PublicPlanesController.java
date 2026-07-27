package com.omnis.saas.auth.infrastructure.adapters.in.web;

import com.omnis.saas.auth.domain.model.PlanSaas;
import com.omnis.saas.auth.domain.ports.in.PlanSaaSUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth/usuarios/public/planes")
@RequiredArgsConstructor
public class PublicPlanesController {

    private final PlanSaaSUseCase planSaaSUseCase;

    @GetMapping
    public ResponseEntity<List<PlanSaas>> obtenerPlanesPublicos() {
        return ResponseEntity.ok(planSaaSUseCase.obtenerTodosLosPlanes());
    }
}