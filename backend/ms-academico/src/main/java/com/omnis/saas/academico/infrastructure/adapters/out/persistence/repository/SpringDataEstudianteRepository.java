package com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.EstudianteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SpringDataEstudianteRepository extends JpaRepository<EstudianteEntity, Long> {

    Optional<EstudianteEntity> findByDniAndColegioId(String dni, Long colegioId);

    boolean existsByDniAndColegioId(String dni, Long colegioId);
}