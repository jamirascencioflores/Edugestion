package com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.EstudianteEntity;
import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EstudianteJpaRepository extends JpaRepository<EstudianteEntity, Long> {
    List<EstudianteEntity> findBySeccionId(Long seccionId);

    Long countByColegioIdAndEstadoTrue(Long colegioId);

    @Query("SELECT COUNT(DISTINCT e.seccion.id) FROM EstudianteEntity e WHERE e.colegioId = :colegioId AND e.estado = true")
    Long countDistinctSeccionesByColegioId(@Param("colegioId") Long colegioId);

    long countByColegioId(Long colegioId);
}