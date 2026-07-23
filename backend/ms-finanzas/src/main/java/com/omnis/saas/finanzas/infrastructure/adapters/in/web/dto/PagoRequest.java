package com.omnis.saas.finanzas.infrastructure.adapters.in.web.dto;

public record PagoRequest(
        String metodoPago,
        String numeroOperacion
) {}