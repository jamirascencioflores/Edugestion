package com.omnis.saas.auth.domain.ports.in;

import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.DashboardKpisDTO;

public interface SuperAdminUseCase {
    DashboardKpisDTO obtenerMetricasDashboard();
}