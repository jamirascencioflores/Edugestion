package com.omnis.saas.finanzas.infrastructure.adapters.in.web;

import com.omnis.saas.finanzas.domain.model.EstadoDeuda;
import com.omnis.saas.finanzas.infrastructure.adapters.in.web.dto.ResumenFinancieroDTO;
import com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.repository.DeudaJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/finanzas/dashboard")
@RequiredArgsConstructor
public class DashboardFinanzasController {

    private final DeudaJpaRepository deudaRepository;

    @GetMapping("/resumen")
    public ResponseEntity<ResumenFinancieroDTO> obtenerResumenFinanciero(
            @RequestHeader("X-Colegio-Id") Long colegioId) {

        LocalDate inicioMes = LocalDate.now().withDayOfMonth(1);
        LocalDate finMes = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());

        // 1. Recaudo cobrado este mes
        BigDecimal cobradoMes = deudaRepository.sumMontoByColegioIdAndEstadoAndFechaVencimientoBetween(
                colegioId, EstadoDeuda.PAGADA, inicioMes, finMes);

        // 2. Total facturado para el mes
        BigDecimal totalMes = deudaRepository.sumMontoByColegioIdAndFechaVencimientoBetween(
                colegioId, inicioMes, finMes);

        cobradoMes = (cobradoMes != null) ? cobradoMes : BigDecimal.ZERO;
        totalMes = (totalMes != null && totalMes.compareTo(BigDecimal.ZERO) > 0) ? totalMes : BigDecimal.ONE;

        double porcentajeRecaudo = (cobradoMes.doubleValue() / totalMes.doubleValue()) * 100;

        // 3. Cálculo de morosidad general
        Long totalDeudasPendientes = deudaRepository.countByColegioIdAndEstado(colegioId, EstadoDeuda.PENDIENTE);
        Long totalDeudas = deudaRepository.countByColegioId(colegioId);
        double porcentajeMorosidad = (totalDeudas > 0) ? ((double) totalDeudasPendientes / totalDeudas) * 100 : 0.0;

        Long alumnosMorosos = deudaRepository.countDistinctEstudianteIdByColegioIdAndEstado(colegioId, EstadoDeuda.PENDIENTE);

        ResumenFinancieroDTO respuesta = ResumenFinancieroDTO.builder()
                .recaudoMesActual(cobradoMes)
                .porcentajeRecaudoMes(Math.round(porcentajeRecaudo * 10.0) / 10.0)
                .porcentajeMorosidad(Math.round(porcentajeMorosidad * 10.0) / 10.0)
                .alumnosMorosos(alumnosMorosos)
                .build();

        return ResponseEntity.ok(respuesta);
    }
}