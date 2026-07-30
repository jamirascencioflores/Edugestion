package com.omnis.saas.academico.infrastructure.adapters.in.web;

import com.omnis.saas.academico.domain.ports.in.ImportacionEstudianteUseCase;
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
public class ImportacionEstudianteController {

    private final ImportacionEstudianteUseCase importacionEstudianteUseCase;

    @PostMapping("/estudiantes")
    public ResponseEntity<?> importarEstudiantes(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "X-Colegio-Id", required = false) Long colegioId) { // 👈 Cambiado a X-Colegio-Id

        if (!ExcelHelper.esFormatoExcel(file)) {
            return ResponseEntity.badRequest().body("Por favor, suba un archivo Excel válido (.xlsx).");
        }

        ImportacionResultadoDTO resultado = importacionEstudianteUseCase.procesarExcelEstudiantes(file, colegioId);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/plantilla/estudiantes")
    public ResponseEntity<byte[]> descargarPlantillaEstudiantes() throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Estudiantes");

            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);

            Row headerRow = sheet.createRow(0);
            String[] columnas = {"DNI", "Nombres", "Apellidos", "Fecha Nacimiento (YYYY-MM-DD)", "Grado", "Sección"};

            for (int i = 0; i < columnas.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnas[i]);
                cell.setCellStyle(headerStyle);
            }

            Object[][] datosEjemplo = {
                    {"78945612", "Juan Manuel", "Pérez López", "2012-05-14", "1ro", "A"},
                    {"75315984", "Maria Jose", "Gómez Soto", "2012-08-20", "1ro", "A"}
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
            headers.setContentDispositionFormData("attachment", "plantilla_estudiantes.xlsx");
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

            return new ResponseEntity<>(out.toByteArray(), headers, HttpStatus.OK);
        }
    }
}