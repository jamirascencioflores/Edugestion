package com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.EstudianteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EstudianteJpaRepository extends JpaRepository<EstudianteEntity, Long> {
    List<EstudianteEntity> findBySeccionId(Long seccionId);

}