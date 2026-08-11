package com.omnis.saas.finanzas.domain.ports.out;

import com.omnis.saas.finanzas.domain.model.Deuda;
import com.omnis.saas.finanzas.domain.model.EstadoDeuda;
import com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.entity.DeudaEntity;

import java.util.List;
import java.util.Optional;

public interface DeudaRepositoryPort {
    List<Deuda> saveAll(List<Deuda> deudas);
    List<Deuda> findByColegioIdAndEstudianteId(Long colegioId, Long estudianteId);

    Optional<Deuda> buscarPorId(Long id);
    Deuda guardar(Deuda deuda);
    List<Deuda> buscarPendientesPorEstudiante(Long colegioId, Long estudianteId);
    List<Deuda> buscarAnuladasPorRetiro(Long colegioId, Long estudianteId);
    List<DeudaEntity> findByColegioIdAndEstado(Long colegioId, EstadoDeuda estado);
}