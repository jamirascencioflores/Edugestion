package com.omnis.saas.academico.infrastructure.util;

import org.apache.poi.ss.usermodel.*;
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

    /**
     * Obtiene el DNI asegurando que no se pierdan los ceros a la izquierda
     */
    public static String getDniFormatted(Cell cell) {
        if (cell == null) return "";
        String valor = getCellValueAsString(cell).trim();
        // Si el valor contiene solo números y tiene menos de 8 dígitos, rellena con ceros a la izquierda
        if (valor.matches("\\d+") && valor.length() > 0 && valor.length() < 8) {
            return String.format("%08d", Long.parseLong(valor));
        }
        return valor;
    }

    /**
     * Parsea fechas en formato Date nativo, serial numérico de Excel (ej. 46063) o texto (DD/MM/YYYY, YYYY-MM-DD)
     */
    public static LocalDate getCellValueAsLocalDate(Cell cell) {
        if (cell == null) return null;

        // 1. Si la celda es tipo fecha nativa formateada
        if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            return cell.getDateCellValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        }

        // 2. Si viene como número serial de Excel puro (ej. 46063)
        if (cell.getCellType() == CellType.NUMERIC) {
            double numericVal = cell.getNumericCellValue();
            if (DateUtil.isValidExcelDate(numericVal)) {
                return DateUtil.getLocalDateTime(numericVal).toLocalDate();
            }
        }

        // 3. Si viene como texto
        String strValue = getCellValueAsString(cell);
        if (strValue.isEmpty()) return null;

        try {
            // Si el texto es un número serial convertido a string
            if (strValue.matches("\\d{5}")) {
                double serial = Double.parseDouble(strValue);
                if (DateUtil.isValidExcelDate(serial)) {
                    return DateUtil.getLocalDateTime(serial).toLocalDate();
                }
            }

            if (strValue.contains("/")) {
                return LocalDate.parse(strValue, DateTimeFormatter.ofPattern("d/M/yyyy"));
            } else if (strValue.contains("-")) {
                return LocalDate.parse(strValue, DateTimeFormatter.ofPattern("yyyy-M-d"));
            }
        } catch (Exception e) {
            return null; // Retorna null para usar el fallback configurado en el servicio
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