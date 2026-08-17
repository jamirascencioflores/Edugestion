package com.omnis.saas.finanzas.application.service;

import com.omnis.saas.finanzas.domain.model.Deuda;
import com.omnis.saas.finanzas.domain.model.HistorialPago;
import com.omnis.saas.finanzas.domain.ports.out.DeudaRepositoryPort;
import com.omnis.saas.finanzas.domain.ports.out.HistorialPagoRepositoryPort;
import com.omnis.saas.finanzas.infrastructure.adapters.in.web.dto.HistorialReporteDTO;
import com.omnis.saas.finanzas.infrastructure.adapters.out.feign.EstudianteFeignClient;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReciboReporteServiceImpl {

    private final DeudaRepositoryPort deudaRepositoryPort;
    private final HistorialPagoRepositoryPort historialPagoRepositoryPort;
    private final EstudianteFeignClient estudianteClient;

    /**
     * Genera el comprobante individual de pago
     */
    public byte[] generarReciboPdf(Long deudaId) {
        try {
            Deuda deuda = deudaRepositoryPort.buscarPorId(deudaId)
                    .orElseThrow(() -> new RuntimeException("Deuda no encontrada"));

            String estudianteNombre = estudianteClient.obtenerNombreEstudiante(
                    deuda.getEstudianteId(),
                    deuda.getColegioId()
            );

            InputStream reportStream = new ClassPathResource("reports/recibo_pago.jrxml").getInputStream();
            JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);

            Map<String, Object> parameters = new HashMap<>();
            String numRecibo = deuda.getNumeroOperacion() != null && !deuda.getNumeroOperacion().isBlank()
                    ? deuda.getNumeroOperacion()
                    : "REC-000" + deuda.getId();

            parameters.put("NUMERO_RECIBO", numRecibo);
            parameters.put("ESTUDIANTE_NOMBRE", estudianteNombre);
            parameters.put("FECHA_PAGO", LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            parameters.put("CONCEPTO", deuda.getConcepto());
            parameters.put("MONTO_TOTAL", String.format("S/ %.2f", deuda.getMonto() != null ? deuda.getMonto() : BigDecimal.ZERO));

            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, new JREmptyDataSource());
            return JasperExportManager.exportReportToPdf(jasperPrint);

        } catch (Exception e) {
            throw new RuntimeException("Error al generar el recibo PDF: " + e.getMessage(), e);
        }
    }

    /**
     * Genera el estado de cuenta y auditoría de movimientos de caja
     */
    public byte[] generarHistorialCajaPdf(Long estudianteId, Long colegioId) {
        try {
            // 1. Obtener nombre del estudiante
            String estudianteNombre = estudianteClient.obtenerNombreEstudiante(estudianteId, colegioId);

            // 2. Obtener movimientos de caja
            List<HistorialPago> historial = historialPagoRepositoryPort.buscarPorEstudiante(estudianteId);

            // 3. Mapear al DTO y calcular montos basados en la Deuda vinculada
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            List<HistorialReporteDTO> listaReporte = new ArrayList<>();
            double totalCobros = 0.0;
            double totalReversiones = 0.0;

            for (HistorialPago hp : historial) {
                // Obtener el monto de la deuda asociada
                BigDecimal montoDeuda = BigDecimal.ZERO;
                if (hp.getDeudaId() != null) {
                    montoDeuda = deudaRepositoryPort.buscarPorId(hp.getDeudaId())
                            .map(Deuda::getMonto)
                            .orElse(BigDecimal.ZERO);
                }

                double montoValor = montoDeuda.doubleValue();
                boolean esCobro = "COBRO".equalsIgnoreCase(hp.getTipoOperacion());

                if (esCobro) {
                    totalCobros += montoValor;
                } else {
                    totalReversiones += montoValor;
                }

                listaReporte.add(new HistorialReporteDTO(
                        hp.getFechaOperacion() != null ? hp.getFechaOperacion().format(formatter) : "-",
                        "Director",
                        hp.getTipoOperacion(),
                        String.format("S/ %.2f", montoValor),
                        hp.getMotivo() != null ? hp.getMotivo() : "-"
                ));
            }

            // 4. Cargar plantilla JRXML
            InputStream reportStream = new ClassPathResource("reports/historial_caja.jrxml").getInputStream();
            JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);

            // 5. Parámetros del reporte
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("ESTUDIANTE_NOMBRE", estudianteNombre);
            parameters.put("TOTAL_INGRESOS", String.format("S/ %.2f", totalCobros));
            parameters.put("TOTAL_REVERSIONES", String.format("-S/ %.2f", totalReversiones));
            parameters.put("BALANCE_NETO", String.format("S/ %.2f", totalCobros - totalReversiones));

            // 6. Llenar y generar PDF
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(listaReporte);
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

            return JasperExportManager.exportReportToPdf(jasperPrint);

        } catch (Exception e) {
            throw new RuntimeException("Error al generar el historial PDF: " + e.getMessage(), e);
        }
    }
}