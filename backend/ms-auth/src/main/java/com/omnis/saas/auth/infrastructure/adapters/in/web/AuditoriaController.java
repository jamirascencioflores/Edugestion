package com.omnis.saas.auth.infrastructure.adapters.in.web;

import com.omnis.saas.auth.domain.model.LogAuditoria;
import com.omnis.saas.auth.domain.ports.in.AuditoriaUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/auth/superadmin/auditoria") // 👈 AGREGAR /api AQUÍ
@RequiredArgsConstructor
public class AuditoriaController {

    private final AuditoriaUseCase auditoriaUseCase;

    @GetMapping
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<List<LogAuditoria>> obtenerLogs() {
        return ResponseEntity.ok(auditoriaUseCase.obtenerTodos());
    }
}