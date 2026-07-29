package com.omnis.saas.auth.infrastructure.adapters.in.web;

import com.omnis.saas.auth.domain.ports.in.ImportacionDocenteUseCase;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.ImportacionResultadoDTO;
import com.omnis.saas.auth.infrastructure.util.ExcelHelper;
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
@RequestMapping("/api/auth/importacion")
@RequiredArgsConstructor
public class ImportacionDocenteController {

    private final ImportacionDocenteUseCase importacionDocenteUseCase;

    @PostMapping("/docentes")
    public ResponseEntity<?> importarDocentes(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("X-Colegio-Id") Long colegioId) {

        if (!ExcelHelper.esFormatoExcel(file)) {
            return ResponseEntity.badRequest().body("Por favor, suba un archivo Excel válido (.xlsx).");
        }

        ImportacionResultadoDTO resultado = importacionDocenteUseCase.procesarExcelDocentes(file, colegioId);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/plantilla/docentes")
    public ResponseEntity<byte[]> descargarPlantillaDocentes() throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Docentes");

            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);

            Row headerRow = sheet.createRow(0);
            String[] columnas = {"DNI / CE", "Nombres", "Apellidos", "Email", "Especialidad"};

            for (int i = 0; i < columnas.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnas[i]);
                cell.setCellStyle(headerStyle);
            }

            Object[][] datosEjemplo = {
                    {"45896231", "Carlos", "Mendoza Ramos", "cmendoza@colegio.edu.pe", "Matemática"},
                    {"71234567", "Ana Maria", "Flores Torres", "aflores@colegio.edu.pe", "Comunicación"}
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
            headers.setContentDispositionFormData("attachment", "plantilla_docentes.xlsx");
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

            return new ResponseEntity<>(out.toByteArray(), headers, HttpStatus.OK);
        }
    }
}