package com.omnis.saas.auth.infrastructure.adapters.in.web.dto;

public record RestablecerPasswordRequestDTO(
        String token,
        String nuevaPassword
) {}