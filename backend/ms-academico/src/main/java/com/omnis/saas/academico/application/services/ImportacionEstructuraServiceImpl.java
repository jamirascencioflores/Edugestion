package com.omnis.saas.academico.application.services;

import com.omnis.saas.academico.domain.ports.in.ImportacionEstructuraUseCase;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.ImportacionResultadoDTO;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.CursoEntity;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.GradoEntity;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.SeccionEntity;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.SpringDataCursoRepository;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.SpringDataGradoRepository;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.SpringDataSeccionRepository;
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

    private final SpringDataGradoRepository gradoRepository;
    private final SpringDataSeccionRepository seccionRepository;
    private final SpringDataCursoRepository cursoRepository;

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
                } catch (IllegalArgumentException e) {
                    fallidos++;
                    errores.add("Fila " + filaActualNum + ": " + e.getMessage());
                } catch (Exception e) {
                    fallidos++;
                    errores.add("Fila " + filaActualNum + ": Error procesando estructura - " + e.getMessage());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al leer el archivo Excel de estructura: " + e.getMessage());
        }

        return ImportacionResultadoDTO.builder()
                .totalFilasProcesadas(filaActualNum > 0 ? filaActualNum - 1 : 0)
                .registrosExitosos(exitosos)
                .registrosFallidos(fallidos)
                .errores(errores)
                .build();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void procesarFila(Row row, Long colegioId, int filaActualNum) {
        String col0 = ExcelHelper.getCellValueAsString(row.getCell(0));
        String col1 = ExcelHelper.getCellValueAsString(row.getCell(1));
        String col2 = ExcelHelper.getCellValueAsString(row.getCell(2));
        String col3 = ExcelHelper.getCellValueAsString(row.getCell(3));

        String nombreGrado;
        String nombreSeccion;
        String nombreCurso;

        // Detección: si la columna 0 es solo el Nivel (ej: "Secundaria"), se desplaza a las siguientes columnas
        if (esSoloNivel(col0)) {
            nombreGrado = col1;
            nombreSeccion = col2;
            nombreCurso = col3;
        } else {
            nombreGrado = col0;
            nombreSeccion = col1;
            nombreCurso = col2;
        }

        if (nombreGrado.isEmpty() || nombreSeccion.isEmpty() || nombreCurso.isEmpty()) {
            throw new IllegalArgumentException("Grado, Sección y Curso son obligatorios.");
        }

        // 1. Limpieza de nombres
        String seccionLimpia = nombreSeccion.trim().toUpperCase().replace("SECCIÓN", "").replace("SECCION", "").trim();
        String cursoLimpio = normalizarNombreCurso(nombreCurso);

        // 2. Grado (búsqueda estricta por número de grado o nombre completo)
        List<GradoEntity> todosLosGrados = gradoRepository.findAll();
        String numExcel = nombreGrado.replaceAll("[^0-9]", "");

        GradoEntity grado = todosLosGrados.stream()
                .filter(g -> g.getColegioId() == null || g.getColegioId().equals(colegioId))
                .filter(g -> {
                    String numBD = g.getNombre().replaceAll("[^0-9]", "");
                    if (!numExcel.isEmpty() && !numBD.isEmpty()) {
                        return numExcel.equals(numBD);
                    }
                    return g.getNombre().trim().equalsIgnoreCase(nombreGrado.trim());
                })
                .findFirst()
                .orElseGet(() -> gradoRepository.save(GradoEntity.builder()
                        .nombre(nombreGrado.trim())
                        .colegioId(colegioId)
                        .estado(true)
                        .build()));

        // 3. Sección (buscar o crear asignando capacidadMaxima)
        seccionRepository.findByNombreAndGradoId(seccionLimpia, grado.getId())
                .orElseGet(() -> seccionRepository.save(SeccionEntity.builder()
                        .nombre(seccionLimpia)
                        .capacidadMaxima(30)
                        .grado(grado)
                        .colegioId(colegioId)
                        .estado(true)
                        .build()));

        // 4. Curso (buscar o crear evitando duplicados)
        List<CursoEntity> todosLosCursos = cursoRepository.findAll();
        boolean cursoExiste = todosLosCursos.stream()
                .anyMatch(c -> c.getColegioId().equals(colegioId) && c.getNombre().equalsIgnoreCase(cursoLimpio));

        if (!cursoExiste) {
            cursoRepository.save(CursoEntity.builder()
                    .nombre(cursoLimpio)
                    .colegioId(colegioId)
                    .estado(true)
                    .build());
        }
    }

    private boolean esSoloNivel(String texto) {
        if (texto == null) return false;
        String t = texto.trim().toLowerCase();
        return (t.equals("secundaria") || t.equals("primaria") || t.equals("inicial"))
                && !t.matches(".*\\d+.*");
    }

    private String normalizarNombreCurso(String curso) {
        if (curso == null) return "";
        String limpio = curso.trim();
        if (limpio.equalsIgnoreCase("Matemáticas")) {
            return "Matemática";
        }
        return limpio;
    }
}