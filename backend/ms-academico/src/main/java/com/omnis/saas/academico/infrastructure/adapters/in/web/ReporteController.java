package com.omnis.saas.academico.infrastructure.adapters.in.web;

import com.omnis.saas.academico.application.services.ReporteServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academico/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteServiceImpl reporteService;

    @GetMapping("/boleta/{estudianteId}/{periodo}")
    public ResponseEntity<byte[]> descargarBoleta(@PathVariable Long estudianteId, @PathVariable String periodo) {

        // TODO: Aquí debes obtener los datos reales del estudiante y sus notas usando tus puertos/repositorios
        String nombre = "Juan Pérez";
        String grado = "3ro A";
        List<?> notas = List.of(); // Lista vacía temporalmente

        byte[] pdf = reporteService.generarBoletaNotasPdf(nombre, grado, periodo, notas);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=boleta-" + estudianteId + "-" + periodo + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}