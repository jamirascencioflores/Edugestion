package com.omnis.saas.auth.infrastructure.adapters.in.web.dto;

public record DashboardKpisDTO(
        long totalColegios,
        long colegiosActivos,
        long colegiosInactivos,
        double ingresosMensualesEstimados // MRR
) {}