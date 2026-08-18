package com.omnis.saas.auth.application.services;

import com.omnis.saas.auth.domain.ports.in.ImportacionDocenteUseCase;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.ImportacionResultadoDTO;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.ColegioEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.DocenteEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.RolEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.UsuarioEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.ColegioJpaRepository;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.DocenteJpaRepository;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.RolJpaRepository;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.UsuarioJpaRepository;
import com.omnis.saas.auth.infrastructure.util.ExcelHelper;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ImportacionDocenteServiceImpl implements ImportacionDocenteUseCase {

    private final DocenteJpaRepository docenteJpaRepository;
    private final UsuarioJpaRepository usuarioJpaRepository;
    private final ColegioJpaRepository colegioJpaRepository;
    private final RolJpaRepository rolJpaRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ImportacionResultadoDTO procesarExcelDocentes(MultipartFile file, Long colegioId) {
        List<String> errores = new ArrayList<>();
        int exitosos = 0;
        int fallidos = 0;
        int filaActualNum = 0;

        ColegioEntity colegio = colegioJpaRepository.findById(colegioId)
                .orElseThrow(() -> new RuntimeException("Colegio no encontrado con ID: " + colegioId));

        RolEntity rolDocente = rolJpaRepository.findByNombre("ROLE_DOCENTE")
                .orElseGet(() -> rolJpaRepository.save(
                        RolEntity.builder()
                                .nombre("ROLE_DOCENTE")
                                .build()
                ));

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                filaActualNum++;
                if (filaActualNum == 1) continue; // Saltar cabecera
                if (ExcelHelper.esFilaVacia(row)) continue;

                try {
                    procesarFilaDocente(row, colegio, rolDocente, colegioId, filaActualNum);
                    exitosos++;
                } catch (IllegalArgumentException e) {
                    fallidos++;
                    errores.add("Fila " + filaActualNum + ": " + e.getMessage());
                } catch (Exception e) {
                    fallidos++;
                    errores.add("Fila " + filaActualNum + ": Error procesando docente - " + e.getMessage());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al leer el archivo Excel de docentes: " + e.getMessage());
        }

        return ImportacionResultadoDTO.builder()
                .totalFilasProcesadas(filaActualNum > 0 ? filaActualNum - 1 : 0)
                .registrosExitosos(exitosos)
                .registrosFallidos(fallidos)
                .errores(errores)
                .build();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void procesarFilaDocente(Row row, ColegioEntity colegio, RolEntity rolDocente, Long colegioId, int filaActualNum) {
        // Lectura de las columnas del Paso 2
        String dni = formatearDni(row.getCell(0));                                    // Col 0: DNI
        String nombres = ExcelHelper.getCellValueAsString(row.getCell(1));             // Col 1: Nombres
        String apellidos = ExcelHelper.getCellValueAsString(row.getCell(2));           // Col 2: Apellidos
        String email = ExcelHelper.getCellValueAsString(row.getCell(3));               // Col 3: Email

        if (dni.trim().isEmpty() || nombres.trim().isEmpty() || apellidos.trim().isEmpty()) {
            throw new IllegalArgumentException("DNI, Nombres y Apellidos del docente son obligatorios.");
        }

        String emailFinal = email.trim().isEmpty() ? ("docente." + dni.trim() + "@colegio.edu.pe") : email.trim().toLowerCase();

        Optional<DocenteEntity> docenteOpt = docenteJpaRepository.findByDocumentoIdentidadAndColegioId(dni.trim(), colegioId);

        UsuarioEntity usuario;
        DocenteEntity docenteEntity;

        if (docenteOpt.isPresent()) {
            // Actualización
            docenteEntity = docenteOpt.get();
            docenteEntity.setNombres(nombres.trim());
            docenteEntity.setApellidos(apellidos.trim());
            docenteEntity.setEmail(emailFinal);
            docenteEntity.setEspecialidad("Docente de Aula");

            usuario = docenteEntity.getUsuarioEntity();
            if (usuario != null) {
                usuario.setEmail(emailFinal);
                usuario.setNombreCompleto(nombres.trim() + " " + apellidos.trim());
                usuarioJpaRepository.save(usuario);
            }
        } else {
            // Inserción
            if (usuarioJpaRepository.existsByEmail(emailFinal)) {
                emailFinal = "docente." + dni.trim() + "@colegio.edu.pe";
            }

            usuario = UsuarioEntity.builder()
                    .email(emailFinal)
                    .passwordHash(passwordEncoder.encode(dni.trim()))
                    .nombreCompleto(nombres.trim() + " " + apellidos.trim())
                    .rolEntity(rolDocente)
                    .colegio(colegio)
                    .estado(true)
                    .debeCambiarPassword(true)
                    .build();

            usuario = usuarioJpaRepository.save(usuario);

            docenteEntity = DocenteEntity.builder()
                    .documentoIdentidad(dni.trim())
                    .nombres(nombres.trim())
                    .apellidos(apellidos.trim())
                    .email(emailFinal)
                    .especialidad("Docente de Aula")
                    .colegio(colegio)
                    .usuarioEntity(usuario)
                    .estado(true)
                    .build();
        }

        docenteJpaRepository.save(docenteEntity);
    }

    private String formatearDni(Cell cell) {
        if (cell == null) return "";
        if (cell.getCellType() == CellType.NUMERIC) {
            long valorNumerico = (long) cell.getNumericCellValue();
            return String.format("%08d", valorNumerico);
        }
        return ExcelHelper.getCellValueAsString(cell).trim();
    }
}