package com.omnis.saas.academico.application.services;

import com.omnis.saas.academico.domain.ports.in.ImportacionUnificadaUseCase;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.ImportacionResultadoDTO;
import com.omnis.saas.academico.infrastructure.adapters.out.feign.AuthDocenteFeignClient;
import com.omnis.saas.academico.infrastructure.util.ExcelHelper;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImportacionUnificadaServiceImpl implements ImportacionUnificadaUseCase {

    private final ImportacionEstructuraServiceImpl importacionEstructuraService;
    private final ImportacionEstudianteServiceImpl importacionEstudianteService;
    private final AuthDocenteFeignClient authDocenteFeignClient;

    @Override
    public ImportacionResultadoDTO procesarExcelMaestro(MultipartFile file, Long colegioId) {
        List<String> errores = new ArrayList<>();
        int exitosos = 0;
        int fallidos = 0;
        int filaNum = 0;

        // 1. Enviar primero todo el archivo a ms-auth para registrar los docentes sin interrumpir ms-academico
        try {
            authDocenteFeignClient.importarDocentes(file, colegioId);
        } catch (Exception e) {
            System.err.println("Aviso docentes: " + e.getMessage());
        }

        // 2. Procesar Estructura y Estudiantes fila por fila en ms-academico
        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                filaNum++;
                if (filaNum == 1) continue; // Saltar cabecera
                if (ExcelHelper.esFilaVacia(row)) continue;

                try {
                    // Cada fila se guarda en su propia transacción aislada
                    importacionEstructuraService.procesarFila(row, colegioId, filaNum);
                    importacionEstudianteService.procesarFilaEstudiante(row, colegioId, filaNum);
                    exitosos++;
                } catch (Exception e) {
                    fallidos++;
                    errores.add("Fila " + filaNum + ": " + e.getMessage());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al procesar el archivo unificado: " + e.getMessage());
        }

        return ImportacionResultadoDTO.builder()
                .totalFilasProcesadas(filaNum > 0 ? filaNum - 1 : 0)
                .registrosExitosos(exitosos)
                .registrosFallidos(fallidos)
                .errores(errores)
                .build();
    }
}