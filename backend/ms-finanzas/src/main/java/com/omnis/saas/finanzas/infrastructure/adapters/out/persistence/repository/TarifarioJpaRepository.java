package com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.entity.TarifarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TarifarioJpaRepository extends JpaRepository<TarifarioEntity, Long> {
    Optional<TarifarioEntity> findByIdAndColegioId(Long id, Long colegioId);
    List<TarifarioEntity> findByColegioIdAndAnioEscolar(Long colegioId, Integer anioEscolar);
}