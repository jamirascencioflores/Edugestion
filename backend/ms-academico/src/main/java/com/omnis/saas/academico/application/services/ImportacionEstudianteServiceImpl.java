package com.omnis.saas.academico.application.services;

import com.omnis.saas.academico.domain.ports.in.ImportacionEstudianteUseCase;
import com.omnis.saas.academico.domain.ports.out.GradoOutputPort;
import com.omnis.saas.academico.domain.ports.out.SeccionOutputPort;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.ImportacionResultadoDTO;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.EstudianteEntity;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.GradoEntity;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.SeccionEntity;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.SpringDataEstudianteRepository;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.SpringDataGradoRepository;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.SpringDataSeccionRepository;
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
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImportacionEstudianteServiceImpl implements ImportacionEstudianteUseCase {

    private final SpringDataEstudianteRepository estudianteRepository;
    private final SpringDataGradoRepository gradoRepository;
    private final SpringDataSeccionRepository seccionRepository;

    @Override
    @Transactional
    public ImportacionResultadoDTO procesarExcelEstudiantes(MultipartFile file, Long colegioId) {
        List<String> errores = new ArrayList<>();
        int exitosos = 0;
        int fallidos = 0;
        int filaActualNum = 0;

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                filaActualNum++;
                if (filaActualNum == 1) continue; // Saltar cabecera
                if (ExcelHelper.esFilaVacia(row)) continue;

                try {
                    String dni = ExcelHelper.getCellValueAsString(row.getCell(0));
                    String nombres = ExcelHelper.getCellValueAsString(row.getCell(1));
                    String apellidos = ExcelHelper.getCellValueAsString(row.getCell(2));
                    String fechaNacStr = ExcelHelper.getCellValueAsString(row.getCell(3));
                    String nombreGrado = ExcelHelper.getCellValueAsString(row.getCell(4));
                    String nombreSeccion = ExcelHelper.getCellValueAsString(row.getCell(5));

                    if (dni.isEmpty() || nombres.isEmpty() || apellidos.isEmpty() || nombreGrado.isEmpty() || nombreSeccion.isEmpty()) {
                        errores.add("Fila " + filaActualNum + ": DNI, Nombres, Apellidos, Grado y Sección son obligatorios.");
                        fallidos++;
                        continue;
                    }

                    if (estudianteRepository.existsByDniAndColegioId(dni, colegioId)) {
                        errores.add("Fila " + filaActualNum + ": Ya existe un estudiante con DNI " + dni);
                        fallidos++;
                        continue;
                    }

                    // 1. Buscar Grado
                    GradoEntity grado = gradoRepository.findByNombreAndColegioId(nombreGrado, colegioId)
                            .orElseThrow(() -> new RuntimeException("Grado '" + nombreGrado + "' no existe en este colegio."));

                    // 2. Buscar Sección
                    SeccionEntity seccion = seccionRepository.findByNombreAndGradoId(nombreSeccion, grado.getId())
                            .orElseThrow(() -> new RuntimeException("Sección '" + nombreSeccion + "' no existe para el grado '" + nombreGrado + "'."));

                    // Parsear fecha nacimiento
                    LocalDate fechaNacimiento = fechaNacStr.isEmpty() ? LocalDate.of(2010, 1, 1) : LocalDate.parse(fechaNacStr, dateFormatter);

                    // 3. Crear Estudiante
                    EstudianteEntity estudiante = EstudianteEntity.builder()
                            .dni(dni)
                            .nombres(nombres)
                            .apellidos(apellidos)
                            .fechaNacimiento(fechaNacimiento)
                            .seccion(seccion)
                            .colegioId(colegioId)
                            .estado(true)
                            .build();

                    estudianteRepository.save(estudiante);
                    exitosos++;

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
}