package com.omnis.saas.comunicacion.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.comunicacion.infrastructure.adapters.out.persistence.entity.AnuncioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnuncioJpaRepository extends JpaRepository<AnuncioEntity, Long> {
    List<AnuncioEntity> findByColegioIdAndEstadoOrderByFechaPublicacionDesc(Long colegioId, Boolean estado);
}