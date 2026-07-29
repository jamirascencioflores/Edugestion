package com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.DocenteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocenteJpaRepository extends JpaRepository<DocenteEntity, Long> {
    List<DocenteEntity> findByColegioId(Long colegioId);
    void deleteByColegioId(Long colegioId);

    // 👈 Método para evitar duplicados en la importación masiva
    boolean existsByDocumentoIdentidadAndColegioId(String documentoIdentidad, Long colegioId);
}