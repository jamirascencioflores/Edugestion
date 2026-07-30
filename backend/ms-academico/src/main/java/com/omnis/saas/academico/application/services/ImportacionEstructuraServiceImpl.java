package com.omnis.saas.academico.application.services;

import com.omnis.saas.academico.domain.model.Curso;
import com.omnis.saas.academico.domain.model.Grado;
import com.omnis.saas.academico.domain.model.Seccion;
import com.omnis.saas.academico.domain.ports.in.ImportacionEstructuraUseCase;
import com.omnis.saas.academico.domain.ports.out.CursoOutputPort;
import com.omnis.saas.academico.domain.ports.out.GradoOutputPort;
import com.omnis.saas.academico.domain.ports.out.SeccionOutputPort;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.ImportacionResultadoDTO;
import com.omnis.saas.academico.infrastructure.config.tenant.TenantContext;
import com.omnis.saas.academico.infrastructure.util.ExcelHelper;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImportacionEstructuraServiceImpl implements ImportacionEstructuraUseCase {

    private final GradoOutputPort gradoOutputPort;
    private final SeccionOutputPort seccionOutputPort;
    private final CursoOutputPort cursoOutputPort;

    @Override
    public ImportacionResultadoDTO procesarExcelEstructura(MultipartFile file, Long colegioId) {
        List<String> errores = new ArrayList<>();
        int exitosos = 0;
        int fallidos = 0;
        int filaActualNum = 0;

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                filaActualNum++;
                if (filaActualNum == 1) continue; // Saltar cabecera
                if (ExcelHelper.esFilaVacia(row)) continue;

                try {
                    procesarFila(row, colegioId, filaActualNum);
                    exitosos++;
                } catch (Exception e) {
                    fallidos++;
                    errores.add("Fila " + filaActualNum + ": " + e.getMessage());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al leer el archivo Excel: " + e.getMessage());
        }

        return ImportacionResultadoDTO.builder()
                .totalFilasProcesadas(filaActualNum > 0 ? filaActualNum - 1 : 0)
                .registrosExitosos(exitosos)
                .registrosFallidos(fallidos)
                .errores(errores)
                .build();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void procesarFila(Row row, Long colegioId, int filaNum) {
        // 👈 Validación de seguridad para evitar colegioId nulo en entidades
        Long colegioIdFinal = (colegioId != null) ? colegioId : TenantContext.getColegioId();
        if (colegioIdFinal == null) {
            colegioIdFinal = 1L; // Fallback
        }

        String col0 = ExcelHelper.getCellValueAsString(row.getCell(0));
        String col1 = ExcelHelper.getCellValueAsString(row.getCell(1));
        String col2 = ExcelHelper.getCellValueAsString(row.getCell(2));
        String col3 = ExcelHelper.getCellValueAsString(row.getCell(3));

        String nombreGrado;
        String nombreSeccion;
        String nombreCurso;

        if (esNombreGrado(col0)) {
            nombreGrado = col0;
            nombreSeccion = col1;
            nombreCurso = col2;
        } else {
            nombreGrado = col1;
            nombreSeccion = col2;
            nombreCurso = col3;
        }

        if (nombreGrado.isEmpty() || nombreSeccion.isEmpty()) {
            throw new IllegalArgumentException("Grado y Sección son obligatorios.");
        }

        final Long finalColegioId = colegioIdFinal;

        // 1. Grado
        final String gradoBuscado = nombreGrado.trim();
        Grado grado = gradoOutputPort.buscarGradoPorNombreYColegio(gradoBuscado, finalColegioId)
                .orElseGet(() -> gradoOutputPort.guardar(
                        Grado.builder()
                                .nombre(gradoBuscado)
                                .orden(filaNum)
                                .colegioId(finalColegioId) // 👈 Garantizado no nulo
                                .estado(true)
                                .build()
                ));

        // 2. Sección
        final String seccionBuscada = nombreSeccion.trim();
        Seccion seccion = seccionOutputPort.buscarSeccionPorNombreYGrado(seccionBuscada, grado.getId())
                .orElseGet(() -> seccionOutputPort.guardar(
                        Seccion.builder()
                                .nombre(seccionBuscada)
                                .gradoId(grado.getId())
                                .colegioId(finalColegioId)
                                .capacidadMaxima(50)
                                .estado(true)
                                .build()
                ));

        // 3. Curso
        if (!nombreCurso.isEmpty()) {
            final String cursoBuscado = nombreCurso.trim();
            cursoOutputPort.buscarCursoPorNombreYColegio(cursoBuscado, finalColegioId)
                    .orElseGet(() -> cursoOutputPort.guardar(
                            Curso.builder()
                                    .nombre(cursoBuscado)
                                    .colegioId(finalColegioId)
                                    .estado(true)
                                    .build()
                    ));
        }
    }

    private boolean esNombreGrado(String texto) {
        if (texto == null || texto.trim().isEmpty()) return false;
        String t = texto.toLowerCase().trim();
        // Reconoce "1° Secundaria", "1 Secundaria", "1ro", "Primaria", etc.
        return t.contains("secundaria") || t.contains("primaria") || t.contains("inicial")
                || t.contains("°") || t.matches(".*\\d+.*");
    }
}