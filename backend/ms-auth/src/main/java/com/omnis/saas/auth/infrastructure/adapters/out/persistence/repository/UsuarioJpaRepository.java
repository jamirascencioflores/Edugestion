package com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UsuarioJpaRepository extends JpaRepository<UsuarioEntity, UUID> {

    Optional<UsuarioEntity> findByEmail(String email);

    @Query("SELECT u FROM UsuarioEntity u WHERE u.colegio.id = :colegioId AND u.rolEntity.nombre = :rolNombre")
    Optional<UsuarioEntity> findFirstByColegioIdAndRolNombre(
            @Param("colegioId") Long colegioId,
            @Param("rolNombre") String rolNombre
    );

    void deleteByColegioId(Long colegioId);

    Optional<UsuarioEntity> findByEmailAndColegioId(String email, Long colegioId);

    Optional<UsuarioEntity> findByTokenActivacion(String tokenActivacion);

    Optional<UsuarioEntity> findByTokenRecuperacion(String tokenRecuperacion);

    boolean existsByEmail(String email);
}