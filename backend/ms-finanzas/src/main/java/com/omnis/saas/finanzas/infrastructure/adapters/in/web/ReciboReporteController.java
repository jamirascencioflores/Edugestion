package com.omnis.saas.finanzas.infrastructure.adapters.in.web;

import com.omnis.saas.finanzas.application.service.ReciboReporteServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finanzas/reportes")
@RequiredArgsConstructor
public class ReciboReporteController {

    private final ReciboReporteServiceImpl reciboReporteService;

    @GetMapping("/recibo/{deudaId}")
    public ResponseEntity<byte[]> descargarRecibo(@PathVariable Long deudaId) {

        byte[] pdf = reciboReporteService.generarReciboPdf(deudaId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=recibo-" + deudaId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}