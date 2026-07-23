package com.omnis.saas.finanzas.infrastructure.adapters.out.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "ms-academico")
public interface EstudianteFeignClient {

    @GetMapping("/api/academicos/estudiantes/{id}/nombre")
    String obtenerNombreEstudiante(
            @PathVariable("id") Long id,
            @RequestHeader("X-Colegio-Id") Long colegioId // 👈 SE AGREGA ESTE HEADER
    );
}