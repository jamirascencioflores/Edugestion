package com.omnis.saas.academico.infrastructure.adapters.in.web;

import com.omnis.saas.academico.domain.ports.in.ImportacionEstructuraUseCase;
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
public class ImportacionController {

    private final ImportacionEstructuraUseCase importacionEstructuraUseCase;

    @PostMapping("/estructura")
    public ResponseEntity<?> importarEstructura(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "X-Tenant-Id", required = false) Long colegioId) {

        if (!ExcelHelper.esFormatoExcel(file)) {
            return ResponseEntity.badRequest().body("Por favor, suba un archivo Excel válido (.xlsx).");
        }

        ImportacionResultadoDTO resultado = importacionEstructuraUseCase.procesarExcelEstructura(file, colegioId);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/plantilla/estructura")
    public ResponseEntity<byte[]> descargarPlantillaEstructura() throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Estructura Base");

            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);

            Row headerRow = sheet.createRow(0);
            String[] columnas = {"Nivel", "Grado", "Sección", "Curso"};

            for (int i = 0; i < columnas.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnas[i]);
                cell.setCellStyle(headerStyle);
            }

            Object[][] datosEjemplo = {
                    {"SECUNDARIA", "1ro", "A", "Matemática"},
                    {"SECUNDARIA", "1ro", "A", "Comunicación"},
                    {"SECUNDARIA", "1ro", "B", "Matemática"},
                    {"PRIMARIA", "6to", "A", "Ciencia y Tecnología"}
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
            headers.setContentDispositionFormData("attachment", "plantilla_estructura_base.xlsx");
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

            return new ResponseEntity<>(out.toByteArray(), headers, HttpStatus.OK);
        }
    }
}