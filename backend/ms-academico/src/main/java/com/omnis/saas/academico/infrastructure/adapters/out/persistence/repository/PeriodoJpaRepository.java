package com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.PeriodoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PeriodoJpaRepository extends JpaRepository<PeriodoEntity, Long> {

    // 👈 Ordena siempre por fecha de inicio ascendente
    List<PeriodoEntity> findByColegioIdOrderByFechaInicioAsc(Long colegioId);

    List<PeriodoEntity> findAllByOrderByFechaInicioAsc();

    // ⚡ 1. Cerrar automáticamente los periodos que expiraron y siguen activos
    @Modifying
    @Query("UPDATE PeriodoEntity p SET p.estado = 'CERRADO' WHERE p.fechaFin < :fecha AND p.estado = 'ACTIVO'")
    void cerrarPeriodosVencidos(@Param("fecha") LocalDate fecha);

    // ⚡ 2. Activar automáticamente el periodo que inicia hoy o ya inició y sigue pendiente
    @Modifying
    @Query("UPDATE PeriodoEntity p SET p.estado = 'ACTIVO' WHERE p.fechaInicio <= :fecha AND p.fechaFin >= :fecha AND p.estado = 'PENDIENTE'")
    void activarPeriodoActual(@Param("fecha") LocalDate fecha);
}