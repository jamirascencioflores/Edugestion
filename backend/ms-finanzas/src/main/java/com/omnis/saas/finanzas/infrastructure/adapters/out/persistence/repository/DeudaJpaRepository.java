package com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.finanzas.domain.model.EstadoDeuda;
import com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.entity.DeudaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DeudaJpaRepository extends JpaRepository<DeudaEntity, Long> {

    // 1. Usado para mostrar la tabla en el frontend (todas las deudas)
    List<DeudaEntity> findByColegioIdAndEstudianteId(Long colegioId, Long estudianteId);

    // 2. NUEVO: Usado por el evento de RabbitMQ para anular solo las pendientes
    List<DeudaEntity> findByColegioIdAndEstudianteIdAndEstado(Long colegioId, Long estudianteId, EstadoDeuda estado);

    // 3. Usado por seguridad
    Optional<DeudaEntity> findByIdAndColegioId(Long id, Long colegioId);

    List<DeudaEntity> findByColegioIdAndEstudianteIdAndEstadoAndMotivoReversion(Long colegioId, Long estudianteId, EstadoDeuda estado, String motivoReversion);
}