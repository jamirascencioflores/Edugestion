package com.omnis.saas.academico.application.services;

import com.omnis.saas.academico.domain.model.Curso;
import com.omnis.saas.academico.domain.model.Grado;
import com.omnis.saas.academico.domain.model.Seccion;
import com.omnis.saas.academico.domain.ports.in.ImportacionEstructuraUseCase;
import com.omnis.saas.academico.domain.ports.out.CursoOutputPort;
import com.omnis.saas.academico.domain.ports.out.GradoOutputPort;
import com.omnis.saas.academico.domain.ports.out.SeccionOutputPort;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.ImportacionResultadoDTO;
import com.omnis.saas.academico.infrastructure.util.ExcelHelper;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
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
    @Transactional
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
                    String nivel = ExcelHelper.getCellValueAsString(row.getCell(0));
                    String nombreGrado = ExcelHelper.getCellValueAsString(row.getCell(1));
                    String nombreSeccion = ExcelHelper.getCellValueAsString(row.getCell(2));
                    String nombreCurso = ExcelHelper.getCellValueAsString(row.getCell(3));

                    if (nombreGrado.isEmpty() || nombreSeccion.isEmpty()) {
                        errores.add("Fila " + filaActualNum + ": Grado y Sección son obligatorios.");
                        fallidos++;
                        continue;
                    }

                    final int ordenCalculado = filaActualNum;

                    // 1. Resolver o Crear Grado
                    Grado grado = gradoOutputPort.buscarGradoPorNombreYColegio(nombreGrado, colegioId)
                            .orElseGet(() -> gradoOutputPort.guardar(
                                    Grado.builder()
                                            .nombre(nombreGrado)
                                            .orden(ordenCalculado)
                                            .colegioId(colegioId)
                                            .estado(true)
                                            .build()
                            ));

                    // 2. Resolver o Crear Sección
                    Seccion seccion = seccionOutputPort.buscarSeccionPorNombreYGrado(nombreSeccion, grado.getId())
                            .orElseGet(() -> seccionOutputPort.guardar(
                                    Seccion.builder()
                                            .nombre(nombreSeccion)
                                            .gradoId(grado.getId())
                                            .build()
                            ));

                    // 3. Resolver o Crear Curso por Colegio
                    if (!nombreCurso.isEmpty()) {
                        cursoOutputPort.buscarCursoPorNombreYColegio(nombreCurso, colegioId)
                                .orElseGet(() -> cursoOutputPort.guardar(
                                        Curso.builder()
                                                .nombre(nombreCurso)
                                                .colegioId(colegioId)
                                                .estado(true)
                                                .build()
                                ));
                    }

                    exitosos++;
                } catch (Exception e) {
                    fallidos++;
                    errores.add("Fila " + filaActualNum + ": Error procesando fila - " + e.getMessage());
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
}