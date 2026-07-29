package com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.SeccionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SpringDataSeccionRepository extends JpaRepository<SeccionEntity, Long> {
    Optional<SeccionEntity> findByNombreAndGradoId(String nombre, Long gradoId);
}