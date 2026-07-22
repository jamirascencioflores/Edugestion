package com.omnis.saas.academico.application.services;

import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReporteServiceImpl {

    public byte[] generarBoletaNotasPdf(String nombreEstudiante, String gradoSeccion, String periodo, List<?> listaCalificaciones) {
        try {
            // 1. Cargar la plantilla desde resources/reports
            InputStream reportStream = new ClassPathResource("reports/boleta_notas.jrxml").getInputStream();
            JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);

            // 2. Parámetros que irán en la cabecera del reporte
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("ESTUDIANTE_NOMBRE", nombreEstudiante);
            parameters.put("GRADO_SECCION", gradoSeccion);
            parameters.put("PERIODO", periodo);

            // 3. Los datos de la tabla (las notas)
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(listaCalificaciones);

            // 4. Llenar el reporte
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

            // 5. Exportar a PDF en memoria (arreglo de bytes)
            return JasperExportManager.exportReportToPdf(jasperPrint);

        } catch (Exception e) {
            throw new RuntimeException("Error al generar el reporte PDF: " + e.getMessage(), e);
        }
    }
}