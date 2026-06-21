package com.omnis.saas.finanzas.infrastructure.adapters.out.persistence;

import com.omnis.saas.finanzas.domain.model.Deuda;
import com.omnis.saas.finanzas.domain.model.EstadoDeuda;
import com.omnis.saas.finanzas.domain.ports.out.DeudaRepositoryPort;
import com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.mapper.DeudaMapper;
import com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.repository.DeudaJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DeudaPersistenceAdapter implements DeudaRepositoryPort {

    private final DeudaJpaRepository repository;
    private final DeudaMapper mapper;

    @Override
    public List<Deuda> saveAll(List<Deuda> deudas) {
        var entities = deudas.stream().map(mapper::toEntity).toList();
        return repository.saveAll(entities).stream().map(mapper::toDomain).toList();
    }

    // 👇 Restaurado al contrato original de la interfaz (sin el parámetro de estado)
    @Override
    public List<Deuda> findByColegioIdAndEstudianteId(Long colegioId, Long estudianteId) {
        return repository.findByColegioIdAndEstudianteId(colegioId, estudianteId)
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Deuda> buscarPorId(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Deuda guardar(Deuda deuda) {
        return mapper.toDomain(repository.save(mapper.toEntity(deuda)));
    }

    @Override
    public List<Deuda> buscarPendientesPorEstudiante(Long colegioId, Long estudianteId) {
        return repository.findByColegioIdAndEstudianteIdAndEstado(colegioId, estudianteId, EstadoDeuda.PENDIENTE)
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public List<Deuda> buscarAnuladasPorRetiro(Long colegioId, Long estudianteId) {
        return repository.findByColegioIdAndEstudianteIdAndEstadoAndMotivoReversion(
                colegioId, estudianteId, EstadoDeuda.ANULADA, "Alumno Retirado"
        ).stream().map(mapper::toDomain).toList();
    }
}