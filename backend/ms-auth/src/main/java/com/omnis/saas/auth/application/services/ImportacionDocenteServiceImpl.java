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
        String cell0 = ExcelHelper.getCellValueAsString(row.getCell(0));

        String dni;
        String nombres;
        String apellidos;
        String email;
        String especialidad;

        // Detecta Plantilla Unificada
        if (esNombreGrado(cell0)) {
            especialidad = ExcelHelper.getCellValueAsString(row.getCell(2)); // Curso como especialidad
            dni = ExcelHelper.getCellValueAsString(row.getCell(3));          // DNI Docente
            nombres = ExcelHelper.getCellValueAsString(row.getCell(4));      // Nombres Docente
            apellidos = ExcelHelper.getCellValueAsString(row.getCell(5));    // Apellidos Docente
            email = ExcelHelper.getCellValueAsString(row.getCell(6));        // Email Docente
        } else {
            dni = cell0;
            nombres = ExcelHelper.getCellValueAsString(row.getCell(1));
            apellidos = ExcelHelper.getCellValueAsString(row.getCell(2));
            email = ExcelHelper.getCellValueAsString(row.getCell(3));
            especialidad = ExcelHelper.getCellValueAsString(row.getCell(4));
        }

        // 👈 Si la fila no contiene datos válidos de docente, la salta limpiamente
        if (dni.trim().isEmpty() || nombres.trim().isEmpty()) {
            return;
        }

        // 1. Buscar por DNI
        Optional<DocenteEntity> docenteOpt = docenteJpaRepository.findByDocumentoIdentidadAndColegioId(dni.trim(), colegioId);

        UsuarioEntity usuario;
        DocenteEntity docenteEntity;

        if (docenteOpt.isPresent()) {
            // 🔄 UPDATE: Si el docente ya existe, actualiza sus datos sin fallar por duplicados
            docenteEntity = docenteOpt.get();
            docenteEntity.setNombres(nombres.trim());
            docenteEntity.setApellidos(apellidos.trim());
            if (!email.isEmpty()) docenteEntity.setEmail(email.trim());
            if (!especialidad.isEmpty()) docenteEntity.setEspecialidad(especialidad.trim());

            usuario = docenteEntity.getUsuarioEntity();
            if (usuario != null) {
                if (!email.isEmpty()) usuario.setEmail(email.trim());
                usuario.setNombreCompleto(nombres.trim() + " " + apellidos.trim());
                usuarioJpaRepository.save(usuario);
            }
        } else {
            // ➕ INSERT: Verifica si el email ya existe en UsuarioEntity para no chocar con la Unique Constraint
            String emailFinal = email.trim();
            if (usuarioJpaRepository.existsByEmail(emailFinal)) {
                emailFinal = "docente." + dni.trim() + "@colegio.edu.pe"; // Email alternativo automático si el email está ocupado por una prueba previa
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
                    .especialidad(especialidad.trim())
                    .colegio(colegio)
                    .usuarioEntity(usuario)
                    .estado(true)
                    .build();
        }

        docenteJpaRepository.save(docenteEntity);
    }

    private boolean esNombreGrado(String texto) {
        if (texto == null || texto.trim().isEmpty()) return false;
        String t = texto.toLowerCase().trim();
        // Reconoce "1° Secundaria", "1 Secundaria", "1ro", "Primaria", etc.
        return t.contains("secundaria") || t.contains("primaria") || t.contains("inicial")
                || t.contains("°") || t.matches(".*\\d+.*");
    }
}