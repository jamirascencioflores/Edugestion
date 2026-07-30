package com.omnis.saas.academico.infrastructure.util;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class ExcelHelper {

    public static String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    public static boolean esFormatoExcel(MultipartFile file) {
        return TYPE.equals(file.getContentType());
    }

    public static String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }
        DataFormatter formatter = new DataFormatter();
        return formatter.formatCellValue(cell).trim();
    }

    // 👈 NUEVO: Parsea celdas de tipo Fecha o String en formato YYYY-MM-DD o DD/MM/YYYY
    public static LocalDate getCellValueAsLocalDate(Cell cell) {
        if (cell == null) return null;

        if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            return cell.getDateCellValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        }

        String strValue = getCellValueAsString(cell);
        if (strValue.isEmpty()) return null;

        try {
            if (strValue.contains("/")) {
                return LocalDate.parse(strValue, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            } else if (strValue.contains("-")) {
                return LocalDate.parse(strValue, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            }
        } catch (Exception e) {
            return null; // Si el formato no es válido, retornará null para aplicar el fallback
        }

        return null;
    }

    public static boolean esFilaVacia(Row row) {
        if (row == null) return true;
        for (int c = row.getFirstCellNum(); c < row.getLastCellNum(); c++) {
            Cell cell = row.getCell(c);
            if (cell != null && cell.getCellType() != CellType.BLANK && !getCellValueAsString(cell).isEmpty()) {
                return false;
            }
        }
        return true;
    }
}