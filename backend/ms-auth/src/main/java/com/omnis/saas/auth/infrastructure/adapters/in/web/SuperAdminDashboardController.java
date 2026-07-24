package com.omnis.saas.auth.infrastructure.adapters.in.web;

import com.omnis.saas.auth.domain.ports.in.SuperAdminUseCase;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.DashboardKpisDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/superadmin/dashboard")
@RequiredArgsConstructor
public class SuperAdminDashboardController {

    private final SuperAdminUseCase superAdminUseCase;

    @GetMapping("/kpis")
    public ResponseEntity<DashboardKpisDTO> obtenerMetricasGlobales() {
        return ResponseEntity.ok(superAdminUseCase.obtenerMetricasDashboard());
    }
}