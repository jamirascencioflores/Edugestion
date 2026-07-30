package com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.EstudianteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SpringDataEstudianteRepository extends JpaRepository<EstudianteEntity, Long> {

    Optional<EstudianteEntity> findByDniAndColegioId(String dni, Long colegioId);

    boolean existsByDniAndColegioId(String dni, Long colegioId);

    // 👈 Método necesario para consultar los IDs de estudiantes por grado (Sincronización de deudas)
    List<EstudianteEntity> findBySeccion_Grado_IdAndColegioId(Long gradoId, Long colegioId);

    // 👈 Método auxiliar para búsquedas por sección
    List<EstudianteEntity> findBySeccionIdAndColegioId(Long seccionId, Long colegioId);
}