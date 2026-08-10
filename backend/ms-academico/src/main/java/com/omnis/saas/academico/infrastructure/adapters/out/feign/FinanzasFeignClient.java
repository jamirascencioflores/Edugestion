package com.omnis.saas.academico.infrastructure.adapters.out.feign;

import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.ResumenFinancieroDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "ms-finanzas")
public interface FinanzasFeignClient {

    @GetMapping("/api/finanzas/dashboard/resumen")
    ResumenFinancieroDTO obtenerResumenFinanciero(@RequestHeader("X-Colegio-Id") Long colegioId);
}