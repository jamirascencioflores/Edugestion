package com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.GradoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GradoJpaRepository extends JpaRepository<GradoEntity, Long> {
    List<GradoEntity> findAllByOrderByOrdenAsc();
}