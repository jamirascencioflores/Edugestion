package com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.LogAuditoriaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogAuditoriaJpaRepository extends JpaRepository<LogAuditoriaEntity, Long> {
}