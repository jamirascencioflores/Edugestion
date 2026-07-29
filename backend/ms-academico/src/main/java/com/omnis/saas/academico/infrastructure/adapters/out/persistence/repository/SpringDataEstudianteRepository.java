package com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.EstudianteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataEstudianteRepository extends JpaRepository<EstudianteEntity, Long> {
    boolean existsByDniAndColegioId(String dni, Long colegioId);
}