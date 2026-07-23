package com.omnis.saas.finanzas.application.service;

import com.omnis.saas.finanzas.domain.model.Deuda;
import com.omnis.saas.finanzas.domain.ports.out.DeudaRepositoryPort;
import com.omnis.saas.finanzas.infrastructure.adapters.out.feign.EstudianteFeignClient;
import net.sf.jasperreports.engine.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReciboReporteServiceImpl {

    private final DeudaRepositoryPort deudaRepositoryPort;
    private final EstudianteFeignClient estudianteClient;

    public byte[] generarReciboPdf(Long deudaId) {
        try {
            // 1. Obtener la deuda
            Deuda deuda = deudaRepositoryPort.buscarPorId(deudaId)
                    .orElseThrow(() -> new RuntimeException("Deuda no encontrada"));

            // 2. Obtener nombre via Feign (pasando id y colegioId)
            String estudianteNombre = estudianteClient.obtenerNombreEstudiante(
                    deuda.getEstudianteId(),
                    deuda.getColegioId()
            );

            // 3. Cargar InputStream del .jrxml de forma segura
            InputStream reportStream = new ClassPathResource("reports/recibo_pago.jrxml").getInputStream();

            // 4. Compilar directamente desde el Stream
            JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);

            // 5. Mapear parámetros
            Map<String, Object> parameters = new HashMap<>();
            String numRecibo = deuda.getNumeroOperacion() != null ? deuda.getNumeroOperacion() : "REC-000" + deuda.getId();

            parameters.put("NUMERO_RECIBO", numRecibo);
            parameters.put("ESTUDIANTE_NOMBRE", estudianteNombre);
            parameters.put("FECHA_PAGO", LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            parameters.put("CONCEPTO", deuda.getConcepto());
            parameters.put("MONTO_TOTAL", String.format("S/ %.2f", deuda.getMonto()));

            // 6. Llenar reporte
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, new JREmptyDataSource());

            // 7. Exportar a PDF
            return JasperExportManager.exportReportToPdf(jasperPrint);

        } catch (Exception e) {
            throw new RuntimeException("Error al generar el recibo PDF: " + e.getMessage(), e);
        }
    }
}