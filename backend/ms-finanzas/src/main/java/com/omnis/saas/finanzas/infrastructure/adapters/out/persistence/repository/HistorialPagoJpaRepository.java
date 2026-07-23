package com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.entity.HistorialPagoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistorialPagoJpaRepository extends JpaRepository<HistorialPagoEntity, Long> {
    List<HistorialPagoEntity> findByEstudianteIdOrderByFechaOperacionDesc(Long estudianteId);
}