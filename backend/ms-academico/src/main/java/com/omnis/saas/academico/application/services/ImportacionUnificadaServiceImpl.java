package com.omnis.saas.academico.application.services;

import com.omnis.saas.academico.domain.ports.in.ImportacionEstudianteUseCase;
import com.omnis.saas.academico.domain.ports.in.ImportacionEstructuraUseCase;
import com.omnis.saas.academico.domain.ports.in.ImportacionUnificadaUseCase;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.ImportacionResultadoDTO;
import com.omnis.saas.academico.infrastructure.adapters.out.feign.AuthDocenteFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImportacionUnificadaServiceImpl implements ImportacionUnificadaUseCase {

    private final ImportacionEstructuraUseCase importacionEstructuraUseCase;
    private final ImportacionEstudianteUseCase importacionEstudianteUseCase;
    private final AuthDocenteFeignClient authDocenteFeignClient;

    @Override
    @Transactional
    public ImportacionResultadoDTO procesarExcelMaestro(MultipartFile file, Long colegioId) {
        List<String> todosLosErrores = new ArrayList<>();
        int totalProcesados = 0;
        int totalExitosos = 0;
        int totalFallidos = 0;

        // 1. Fase 1: Importar Estructura (Grados, Secciones y Cursos)
        ImportacionResultadoDTO resEstructura = importacionEstructuraUseCase.procesarExcelEstructura(file, colegioId);
        todosLosErrores.addAll(resEstructura.getErrores());

        // 2. Fase 2: Importar Docentes (vía Feign a ms-auth)
        try {
            ImportacionResultadoDTO resDocentes = authDocenteFeignClient.importarDocentes(file, colegioId);
            todosLosErrores.addAll(resDocentes.getErrores());
        } catch (Exception e) {
            todosLosErrores.add("Error al sincronizar docentes con el servicio de autenticación: " + e.getMessage());
        }

        // 3. Fase 3: Importar Estudiantes
        ImportacionResultadoDTO resEstudiantes = importacionEstudianteUseCase.procesarExcelEstudiantes(file, colegioId);
        todosLosErrores.addAll(resEstudiantes.getErrores());

        // Consolidación de métricas de procesamiento
        totalProcesados = Math.max(resEstructura.getTotalFilasProcesadas(), resEstudiantes.getTotalFilasProcesadas());
        totalFallidos = todosLosErrores.size();
        totalExitosos = Math.max(0, totalProcesados - totalFallidos);

        return ImportacionResultadoDTO.builder()
                .totalFilasProcesadas(totalProcesados)
                .registrosExitosos(totalExitosos)
                .registrosFallidos(totalFallidos)
                .errores(todosLosErrores)
                .build();
    }
}