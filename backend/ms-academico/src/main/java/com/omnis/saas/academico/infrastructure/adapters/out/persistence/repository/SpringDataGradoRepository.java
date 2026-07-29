package com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.GradoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SpringDataGradoRepository extends JpaRepository<GradoEntity, Long> {
    Optional<GradoEntity> findByNombreAndColegioId(String nombre, Long colegioId);
}