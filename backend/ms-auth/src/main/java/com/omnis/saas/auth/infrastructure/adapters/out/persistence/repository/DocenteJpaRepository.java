package com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.DocenteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DocenteJpaRepository extends JpaRepository<DocenteEntity, Long> {
    List<DocenteEntity> findByColegioId(Long colegioId);
    void deleteByColegioId(Long colegioId);

    // Método para la verificación
    boolean existsByDocumentoIdentidadAndColegioId(String documentoIdentidad, Long colegioId);

    // 👈 AGREGA ESTE MÉTODO PARA EL UPSERT
    Optional<DocenteEntity> findByDocumentoIdentidadAndColegioId(String documentoIdentidad, Long colegioId);
}