package com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.AreaAcademicaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AreaAcademicaJpaRepository extends JpaRepository<AreaAcademicaEntity, Long> {
}