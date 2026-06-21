package com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.CursoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CursoJpaRepository extends JpaRepository<CursoEntity, Long> {
    // Ordena los cursos de la A a la Z
    List<CursoEntity> findAllByOrderByNombreAsc();
}