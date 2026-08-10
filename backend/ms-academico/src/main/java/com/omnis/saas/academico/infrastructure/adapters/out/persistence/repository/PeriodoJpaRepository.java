package com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.PeriodoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PeriodoJpaRepository extends JpaRepository<PeriodoEntity, Long> {

    // 👈 Ordena siempre por fecha de inicio ascendente
    List<PeriodoEntity> findByColegioIdOrderByFechaInicioAsc(Long colegioId);

    List<PeriodoEntity> findAllByOrderByFechaInicioAsc();
}