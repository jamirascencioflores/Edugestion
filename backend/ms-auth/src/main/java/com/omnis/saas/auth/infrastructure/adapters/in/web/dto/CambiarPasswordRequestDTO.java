package com.omnis.saas.auth.infrastructure.adapters.in.web.dto;

public record CambiarPasswordRequestDTO(
        String actualPassword,
        String nuevaPassword
) {}