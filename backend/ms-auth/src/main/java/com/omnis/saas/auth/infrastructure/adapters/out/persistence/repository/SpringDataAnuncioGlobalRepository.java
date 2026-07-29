package com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.AnuncioGlobalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SpringDataAnuncioGlobalRepository extends JpaRepository<AnuncioGlobalEntity, Long> {
    List<AnuncioGlobalEntity> findByActivoTrue();
}