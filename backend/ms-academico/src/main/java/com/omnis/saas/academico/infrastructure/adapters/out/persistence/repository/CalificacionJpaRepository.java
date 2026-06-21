package com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.CalificacionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CalificacionJpaRepository extends JpaRepository<CalificacionEntity, Long> {
    List<CalificacionEntity> findByColegioIdAndCursoIdAndPeriodo(Long colegioId, Long cursoId, String periodo);
    List<CalificacionEntity> findByColegioIdAndEstudianteIdAndPeriodo(Long colegioId, Long estudianteId, String periodo);
    List<CalificacionEntity> findByColegioIdAndCursoId(Long colegioId, Long cursoId);
}