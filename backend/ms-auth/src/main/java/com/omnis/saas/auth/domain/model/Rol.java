package com.omnis.saas.auth.domain.model;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Rol {
    private Long id;
    private String nombre;
}