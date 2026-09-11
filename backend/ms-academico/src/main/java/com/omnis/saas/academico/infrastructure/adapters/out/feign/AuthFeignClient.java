package com.omnis.saas.academico.infrastructure.adapters.out.feign;

import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.ImportacionResultadoDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "ms-auth")
public interface AuthFeignClient {

    @PostMapping(value = "/api/auth/importacion/docentes", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ImportacionResultadoDTO importarDocentes(
            @RequestPart("file") MultipartFile file,
            @RequestHeader("X-Colegio-Id") Long colegioId
    );

    // Consulta de límite SaaS agregada al mismo cliente
    @GetMapping("/api/auth/planes/limite-alumnos")
    Integer obtenerLimiteAlumnos(@RequestHeader("X-Colegio-Id") Long colegioId);
}