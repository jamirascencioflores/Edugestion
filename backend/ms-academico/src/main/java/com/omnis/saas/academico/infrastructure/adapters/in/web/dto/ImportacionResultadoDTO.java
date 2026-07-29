package com.omnis.saas.academico.infrastructure.adapters.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ImportacionResultadoDTO {
    private int totalFilasProcesadas;
    private int registrosExitosos;
    private int registrosFallidos;

    @Builder.Default
    private List<String> errores = new ArrayList<>();
}