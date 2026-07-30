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

        // 👈 Si no existe ROLE_DOCENTE, se crea automáticamente
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
        String dni = ExcelHelper.getCellValueAsString(row.getCell(0));
        String nombres = ExcelHelper.getCellValueAsString(row.getCell(1));
        String apellidos = ExcelHelper.getCellValueAsString(row.getCell(2));
        String email = ExcelHelper.getCellValueAsString(row.getCell(3));
        String especialidad = ExcelHelper.getCellValueAsString(row.getCell(4));

        if (dni.isEmpty() || nombres.isEmpty() || apellidos.isEmpty() || email.isEmpty()) {
            throw new IllegalArgumentException("DNI, Nombres, Apellidos y Email son requeridos.");
        }

        // 1. Buscar si ya existe el perfil de docente por DNI y colegio
        Optional<DocenteEntity> docenteOpt = docenteJpaRepository.findByDocumentoIdentidadAndColegioId(dni, colegioId);

        UsuarioEntity usuario;
        DocenteEntity docenteEntity;

        if (docenteOpt.isPresent()) {
            // 🔄 ACTUALIZACIÓN (UPDATE)
            docenteEntity = docenteOpt.get();
            usuario = docenteEntity.getUsuarioEntity();

            if (usuario != null) {
                usuario.setEmail(email);
                usuario.setNombreCompleto(nombres + " " + apellidos);
                usuarioJpaRepository.save(usuario);
            }

            docenteEntity.setNombres(nombres);
            docenteEntity.setApellidos(apellidos);
            docenteEntity.setEmail(email);
            docenteEntity.setEspecialidad(especialidad);

        } else {
            // ➕ CREACIÓN (INSERT)
            usuario = UsuarioEntity.builder()
                    .email(email)
                    .passwordHash(passwordEncoder.encode(dni))
                    .nombreCompleto(nombres + " " + apellidos)
                    .rolEntity(rolDocente)
                    .colegio(colegio)
                    .estado(true)
                    .debeCambiarPassword(true)
                    .build();

            usuario = usuarioJpaRepository.save(usuario);

            docenteEntity = DocenteEntity.builder()
                    .documentoIdentidad(dni)
                    .nombres(nombres)
                    .apellidos(apellidos)
                    .email(email)
                    .especialidad(especialidad)
                    .colegio(colegio)
                    .usuarioEntity(usuario)
                    .estado(true)
                    .build();
        }

        docenteJpaRepository.save(docenteEntity);
    }
}