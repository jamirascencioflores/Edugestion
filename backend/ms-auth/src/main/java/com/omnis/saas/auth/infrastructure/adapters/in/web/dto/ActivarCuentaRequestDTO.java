package com.omnis.saas.auth.infrastructure.adapters.in.web.dto;

public record ActivarCuentaRequestDTO(
        String token,
        String nuevaPassword
) {}