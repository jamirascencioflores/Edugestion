package com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.finanzas.domain.model.EstadoDeuda;
import com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.entity.DeudaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // 👈 CORREGIDO: Usar el Param de Spring Data

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DeudaJpaRepository extends JpaRepository<DeudaEntity, Long> {

    // 1. Usado para mostrar la tabla en el frontend (todas las deudas)
    List<DeudaEntity> findByColegioIdAndEstudianteId(Long colegioId, Long estudianteId);

    // 2. NUEVO: Usado por el evento de RabbitMQ para anular solo las pendientes
    List<DeudaEntity> findByColegioIdAndEstudianteIdAndEstado(Long colegioId, Long estudianteId, EstadoDeuda estado);

    // 3. Usado por seguridad
    Optional<DeudaEntity> findByIdAndColegioId(Long id, Long colegioId);

    List<DeudaEntity> findByColegioIdAndEstudianteIdAndEstadoAndMotivoReversion(Long colegioId, Long estudianteId, EstadoDeuda estado, String motivoReversion);

    Long countByColegioId(Long colegioId);
    Long countByColegioIdAndEstado(Long colegioId, EstadoDeuda estado);

    @Query("SELECT COUNT(DISTINCT d.estudianteId) FROM DeudaEntity d WHERE d.colegioId = :colegioId AND d.estado = :estado")
    Long countDistinctEstudianteIdByColegioIdAndEstado(@Param("colegioId") Long colegioId, @Param("estado") EstadoDeuda estado);

    @Query("SELECT SUM(d.monto) FROM DeudaEntity d WHERE d.colegioId = :colegioId AND d.estado = :estado AND d.fechaVencimiento BETWEEN :inicio AND :fin")
    BigDecimal sumMontoByColegioIdAndEstadoAndFechaVencimientoBetween(@Param("colegioId") Long colegioId, @Param("estado") EstadoDeuda estado, @Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);

    @Query("SELECT SUM(d.monto) FROM DeudaEntity d WHERE d.colegioId = :colegioId AND d.fechaVencimiento BETWEEN :inicio AND :fin")
    BigDecimal sumMontoByColegioIdAndFechaVencimientoBetween(@Param("colegioId") Long colegioId, @Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);

    List<DeudaEntity> findByColegioIdAndEstado(Long colegioId, EstadoDeuda estado);
}