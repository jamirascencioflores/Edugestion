package com.omnis.saas.academico.application.services;

import com.omnis.saas.academico.domain.ports.in.ImportacionEstudianteUseCase;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.ImportacionResultadoDTO;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.EstudianteEntity;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.GradoEntity;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.SeccionEntity;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.SpringDataEstudianteRepository;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.SpringDataGradoRepository;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.SpringDataSeccionRepository;
import com.omnis.saas.academico.infrastructure.util.ExcelHelper;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImportacionEstudianteServiceImpl implements ImportacionEstudianteUseCase {

    private final SpringDataEstudianteRepository estudianteRepository;
    private final SpringDataGradoRepository gradoRepository;
    private final SpringDataSeccionRepository seccionRepository;
    private final RestTemplate restTemplate;

    @Override
    public ImportacionResultadoDTO procesarExcelEstudiantes(MultipartFile file, Long colegioId) {
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
                    procesarFilaEstudiante(row, colegioId, filaActualNum);
                    exitosos++;
                } catch (IllegalArgumentException e) {
                    fallidos++;
                    errores.add("Fila " + filaActualNum + ": " + e.getMessage());
                } catch (Exception e) {
                    fallidos++;
                    errores.add("Fila " + filaActualNum + ": Error procesando estudiante - " + e.getMessage());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al leer el archivo Excel de estudiantes: " + e.getMessage());
        }

        return ImportacionResultadoDTO.builder()
                .totalFilasProcesadas(filaActualNum > 0 ? filaActualNum - 1 : 0)
                .registrosExitosos(exitosos)
                .registrosFallidos(fallidos)
                .errores(errores)
                .build();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void procesarFilaEstudiante(Row row, Long colegioId, int filaActualNum) {
        // Lectura directa de las 11 columnas del Paso 3 (Estudiantes y Apoderados)
        String dni = ExcelHelper.getDniFormatted(row.getCell(0));                            // Col 0: DNI Alumno
        String nombres = ExcelHelper.getCellValueAsString(row.getCell(1));                    // Col 1: Nombres Alumno
        String apellidos = ExcelHelper.getCellValueAsString(row.getCell(2));                  // Col 2: Apellidos Alumno
        String nombreGrado = ExcelHelper.getCellValueAsString(row.getCell(3));                // Col 3: Grado
        String nombreSeccion = ExcelHelper.getCellValueAsString(row.getCell(4));              // Col 4: Sección
        Cell cellNacimiento = row.getCell(5);                                                // Col 5: Fecha Nacimiento
        Cell cellInscripcion = row.getCell(6);                                               // Col 6: Fecha Inscripción
        String dniApoderado = ExcelHelper.getDniFormatted(row.getCell(7));                   // Col 7: DNI Apoderado
        String nombreApoderado = ExcelHelper.getCellValueAsString(row.getCell(8));            // Col 8: Nombres Apoderado
        String apellidosApoderado = ExcelHelper.getCellValueAsString(row.getCell(9));         // Col 9: Apellidos Apoderado
        String telefonoApoderado = ExcelHelper.getCellValueAsString(row.getCell(10));         // Col 10: Teléfono Apoderado

        // Parseo seguro de fechas
        LocalDate fechaNacimientoExcel = ExcelHelper.getCellValueAsLocalDate(cellNacimiento);
        final LocalDate fechaNacimientoFinal = (fechaNacimientoExcel != null) ? fechaNacimientoExcel : LocalDate.of(2012, 1, 1);

        LocalDate fechaInscripcionExcel = ExcelHelper.getCellValueAsLocalDate(cellInscripcion);
        final LocalDate fechaInscripcionFinal = (fechaInscripcionExcel != null) ? fechaInscripcionExcel : LocalDate.now();

        if (dni.isEmpty() || nombres.isEmpty() || apellidos.isEmpty() || nombreGrado.isEmpty() || nombreSeccion.isEmpty()) {
            throw new IllegalArgumentException("DNI, Nombres, Apellidos, Grado y Sección del estudiante son obligatorios.");
        }

        List<GradoEntity> todosLosGrados = gradoRepository.findAll();

        String numExcel = nombreGrado.replaceAll("[^0-9]", "");
        String gradoLimpioExcel = normalizarTexto(nombreGrado);

        GradoEntity grado = todosLosGrados.stream()
                .filter(g -> g.getColegioId() == null || g.getColegioId().equals(colegioId))
                .filter(g -> {
                    String numBD = g.getNombre().replaceAll("[^0-9]", "");
                    String gradoLimpioBD = normalizarTexto(g.getNombre());

                    if (!numExcel.isEmpty() && !numBD.isEmpty() && numExcel.equals(numBD)) {
                        return true;
                    }
                    return gradoLimpioBD.contains(gradoLimpioExcel) || gradoLimpioExcel.contains(gradoLimpioBD);
                })
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Grado '" + nombreGrado + "' no existe en la estructura registrada de este colegio."));

        SeccionEntity seccion = seccionRepository.findByNombreAndGradoId(nombreSeccion.trim(), grado.getId())
                .orElseThrow(() -> new IllegalArgumentException("Sección '" + nombreSeccion + "' no existe para el grado '" + grado.getNombre() + "'."));

        EstudianteEntity estudiante = estudianteRepository.findByDniAndColegioId(dni, colegioId)
                .orElseGet(() -> EstudianteEntity.builder()
                        .dni(dni)
                        .colegioId(colegioId)
                        .estado(true)
                        .build());

        estudiante.setNombres(nombres);
        estudiante.setApellidos(apellidos);
        estudiante.setFechaNacimiento(fechaNacimientoFinal);
        estudiante.setFechaInscripcion(fechaInscripcionFinal);
        estudiante.setSeccion(seccion);

        String apoderadoCompleto = (nombreApoderado + " " + apellidosApoderado).trim();
        if (!apoderadoCompleto.isEmpty()) {
            estudiante.setNombreApoderado(apoderadoCompleto);
        }
        if (!dniApoderado.isEmpty()) {
            estudiante.setDniApoderado(dniApoderado.trim());
        }
        if (!telefonoApoderado.isEmpty()) {
            estudiante.setTelefonoApoderado(telefonoApoderado.trim());
        }

        EstudianteEntity estudianteGuardado = estudianteRepository.save(estudiante);

        asignarOCompletarDeudasEstudiante(colegioId, estudianteGuardado.getId(), grado.getId(), 2026, fechaInscripcionFinal);
    }

    private String normalizarTexto(String texto) {
        if (texto == null) return "";
        return texto.trim()
                .toLowerCase()
                .replace("°", "")
                .replace("ro", "")
                .replace("do", "")
                .replace("to", "")
                .replace("er", "");
    }

    private void asignarOCompletarDeudasEstudiante(Long colegioId, Long estudianteId, Long gradoId, Integer anioEscolar, LocalDate fechaInscripcion) {
        try {
            restTemplate.postForEntity(
                    "http://ms-finanzas/api/finanzas/deudas/generar-cronograma?estudianteId=" + estudianteId
                            + "&gradoId=" + gradoId
                            + "&anioEscolar=" + anioEscolar
                            + "&fechaInscripcion=" + fechaInscripcion,
                    crearHttpEntityConHeader(colegioId),
                    Void.class
            );
        } catch (Exception e) {
            System.out.println("Aviso: No se pudieron sincronizar deudas para estudiante " + estudianteId + ". " + e.getMessage());
        }
    }

    private HttpEntity<Void> crearHttpEntityConHeader(Long colegioId) {
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set("X-Colegio-Id", String.valueOf(colegioId));
        return new org.springframework.http.HttpEntity<>(headers);
    }
}