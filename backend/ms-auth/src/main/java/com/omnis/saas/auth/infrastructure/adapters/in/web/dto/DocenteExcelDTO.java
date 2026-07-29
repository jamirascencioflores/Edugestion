package com.omnis.saas.auth.infrastructure.adapters.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DocenteExcelDTO {
    private String documentoIdentidad;
    private String nombres;
    private String apellidos;
    private String email;
    private String especialidad;
}