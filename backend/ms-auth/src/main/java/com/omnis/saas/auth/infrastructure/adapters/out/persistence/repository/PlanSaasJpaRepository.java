package com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.PlanSaasEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PlanSaasJpaRepository extends JpaRepository<PlanSaasEntity, Long> {
    Optional<PlanSaasEntity> findByNombre(String nombre);
}