package com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.SeccionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeccionJpaRepository extends JpaRepository<SeccionEntity, Long> {
    // Ordena por Grado y luego por Nombre de Sección automáticamente
    List<SeccionEntity> findAllByOrderByGrado_IdAscNombreAsc();
}