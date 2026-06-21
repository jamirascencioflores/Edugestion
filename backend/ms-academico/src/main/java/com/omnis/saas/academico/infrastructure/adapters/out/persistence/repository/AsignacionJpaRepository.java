package com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.AsignacionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AsignacionJpaRepository extends JpaRepository<AsignacionEntity, Long> {
    // 👇 Esto ordenará la tabla de la malla por curso en el frontend
    List<AsignacionEntity> findBySeccionIdOrderByCursoIdAsc(Long seccionId);
    List<AsignacionEntity> findByDocenteId(String docenteId);
}