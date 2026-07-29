package com.omnis.saas.academico.infrastructure.adapters.in.web;

import com.omnis.saas.academico.domain.ports.in.ImportacionUnificadaUseCase;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.ImportacionResultadoDTO;
import com.omnis.saas.academico.infrastructure.util.ExcelHelper;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@RestController
@RequestMapping("/api/academico/importacion")
@RequiredArgsConstructor
public class ImportacionUnificadaController {

    private final ImportacionUnificadaUseCase importacionUnificadaUseCase;

    @PostMapping("/maestro")
    public ResponseEntity<?> importarExcelMaestro(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "X-Tenant-Id", required = false) Long colegioId) {

        if (!ExcelHelper.esFormatoExcel(file)) {
            return ResponseEntity.badRequest().body("Por favor, suba un archivo Excel válido (.xlsx).");
        }

        ImportacionResultadoDTO resultado = importacionUnificadaUseCase.procesarExcelMaestro(file, colegioId);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/plantilla/maestro")
    public ResponseEntity<byte[]> descargarPlantillaMaestro() throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Carga Unificada");

            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);

            Row headerRow = sheet.createRow(0);
            String[] columnas = {
                    "Grado", "Sección", "Curso",
                    "DNI Docente", "Nombres Docente", "Apellidos Docente", "Email Docente",
                    "DNI Alumno", "Nombres Alumno", "Apellidos Alumno"
            };

            for (int i = 0; i < columnas.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnas[i]);
                cell.setCellStyle(headerStyle);
            }

            Object[][] datosEjemplo = {
                    {"1ro", "A", "Matemática", "45896231", "Carlos", "Mendoza Ramos", "cmendoza@colegio.edu.pe", "78945612", "Juan Manuel", "Pérez López"},
                    {"1ro", "A", "Comunicación", "71234567", "Ana Maria", "Flores Torres", "aflores@colegio.edu.pe", "75315984", "Maria Jose", "Gómez Soto"}
            };

            int rowNum = 1;
            for (Object[] filaData : datosEjemplo) {
                Row row = sheet.createRow(rowNum++);
                for (int colNum = 0; colNum < filaData.length; colNum++) {
                    row.createCell(colNum).setCellValue((String) filaData[colNum]);
                }
            }

            for (int i = 0; i < columnas.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentDispositionFormData("attachment", "plantilla_carga_unificada.xlsx");
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

            return new ResponseEntity<>(out.toByteArray(), headers, HttpStatus.OK);
        }
    }
}