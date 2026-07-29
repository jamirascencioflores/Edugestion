package com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.CursoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SpringDataCursoRepository extends JpaRepository<CursoEntity, Long> {
    Optional<CursoEntity> findByNombreAndColegioId(String nombre, Long colegioId);
}