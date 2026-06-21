package com.omnis.saas.auth.infrastructure.adapters.in.web.dto;

public record AuthResponseDTO(
        String token,
        Boolean debeCambiarPassword
) {}