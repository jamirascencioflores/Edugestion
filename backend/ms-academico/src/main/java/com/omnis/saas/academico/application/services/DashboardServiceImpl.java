package com.omnis.saas.academico.application.services;

import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.DashboardDirectorDTO;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.ResumenFinancieroDTO;
import com.omnis.saas.academico.infrastructure.adapters.out.feign.FinanzasFeignClient;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.EstudianteJpaRepository;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.AsignacionJpaRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl {

    private final EstudianteJpaRepository estudianteRepository;
    private final AsignacionJpaRepository asignacionRepository;
    private final FinanzasFeignClient finanzasFeignClient; // 👈 Inyección Feign

    @Transactional(readOnly = true)
    public DashboardDirectorDTO obtenerResumenDashboard(Long colegioId) {
        // 1. Datos Académicos en tiempo real (BD ms-academico)
        Long totalEstudiantes = estudianteRepository.countByColegioIdAndEstadoTrue(colegioId);
        Long seccionesActivas = estudianteRepository.countDistinctSeccionesByColegioId(colegioId);
        Long totalDocentes = asignacionRepository.countDistinctDocenteIdByColegioIdAndEstadoTrue(colegioId);

        // 2. Datos Financieros en tiempo real (vía Feign a ms-finanzas)
        BigDecimal cobradoMes = BigDecimal.ZERO;
        double porcentajeRecaudo = 0.0;
        double porcentajeMorosidad = 0.0;
        Long alumnosMorosos = 0L;

        try {
            ResumenFinancieroDTO finanzas = finanzasFeignClient.obtenerResumenFinanciero(colegioId);
            if (finanzas != null) {
                cobradoMes = finanzas.getRecaudoMesActual() != null ? finanzas.getRecaudoMesActual() : BigDecimal.ZERO;
                porcentajeRecaudo = finanzas.getPorcentajeRecaudoMes() != null ? finanzas.getPorcentajeRecaudoMes() : 0.0;
                porcentajeMorosidad = finanzas.getPorcentajeMorosidad() != null ? finanzas.getPorcentajeMorosidad() : 0.0;
                alumnosMorosos = finanzas.getAlumnosMorosos() != null ? finanzas.getAlumnosMorosos() : 0L;
            }
        } catch (Exception e) {
            log.warn("No se pudo conectar con ms-finanzas para el dashboard del colegio {}: {}", colegioId, e.getMessage());
        }

        List<DashboardDirectorDTO.RecaudacionMensualDTO> recaudacionMensual = List.of(
                new DashboardDirectorDTO.RecaudacionMensualDTO("Mar", 85.0, 15.0),
                new DashboardDirectorDTO.RecaudacionMensualDTO("Abr", 78.0, 22.0),
                new DashboardDirectorDTO.RecaudacionMensualDTO("May", 90.0, 10.0),
                new DashboardDirectorDTO.RecaudacionMensualDTO("Jun", 65.0, 35.0),
                new DashboardDirectorDTO.RecaudacionMensualDTO("Jul", 40.0, 60.0)
        );

        return DashboardDirectorDTO.builder()
                .totalEstudiantes(totalEstudiantes)
                .porcentajeCrecimientoEstudiantes(12.0)
                .seccionesActivas(seccionesActivas)
                .totalDocentes(totalDocentes)
                .docentesSinAsignar(0L)
                .recaudoMesActual(cobradoMes)
                .porcentajeRecaudoMes(porcentajeRecaudo)
                .porcentajeMorosidad(porcentajeMorosidad)
                .alumnosMorosos(alumnosMorosos)
                .recaudacionMensual(recaudacionMensual)
                .alertas(new DashboardDirectorDTO.AlertasDTO(0))
                .build();
    }
}