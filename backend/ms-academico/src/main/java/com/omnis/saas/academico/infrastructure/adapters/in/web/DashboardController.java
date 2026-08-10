package com.omnis.saas.academico.infrastructure.adapters.in.web;

import com.omnis.saas.academico.application.services.DashboardServiceImpl;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.DashboardDirectorDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/academicos/dashboard/director") // 👈 Agregamos 'academicos'
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardServiceImpl dashboardService;

    @GetMapping("/resumen")
    public ResponseEntity<DashboardDirectorDTO> obtenerResumen(@RequestHeader("X-Colegio-Id") Long colegioId) {
        return ResponseEntity.ok(dashboardService.obtenerResumenDashboard(colegioId));
    }
}