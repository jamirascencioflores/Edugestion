package com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.PeriodoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PeriodoJpaRepository extends JpaRepository<PeriodoEntity, Long> {
}