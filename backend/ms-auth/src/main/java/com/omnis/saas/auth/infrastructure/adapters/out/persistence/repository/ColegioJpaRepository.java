package com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.ColegioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ColegioJpaRepository extends JpaRepository<ColegioEntity, Long> {

    // Cambiamos 'ACTIVO' por true
    @Query("SELECT c FROM ColegioEntity c WHERE c.estado = true AND c.fechaVencimientoSuscripcion < :hoy")
    List<ColegioEntity> buscarActivosVencidos(@Param("hoy") LocalDate hoy);

    // SOLUCIÓN AL ERROR 403: Forzamos la carga del planSaaS en la misma consulta
    @Query("SELECT c FROM ColegioEntity c JOIN FETCH c.plan WHERE c.subdominio = :subdominio")
    Optional<ColegioEntity> findBySubdominio(@Param("subdominio") String subdominio);

    @Modifying
    @Query("UPDATE ColegioEntity c SET c.estado = CASE WHEN c.estado = true THEN false ELSE true END WHERE c.id = :id")
    void toggleEstado(@Param("id") Long id);
}