package com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.SuscripcionColegioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SuscripcionColegioJpaRepository extends JpaRepository<SuscripcionColegioEntity, Long> {
    Optional<SuscripcionColegioEntity> findByColegioId(Long colegioId);
}