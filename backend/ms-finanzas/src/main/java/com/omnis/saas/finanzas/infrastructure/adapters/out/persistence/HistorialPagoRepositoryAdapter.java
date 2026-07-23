package com.omnis.saas.finanzas.infrastructure.adapters.out.persistence;

import com.omnis.saas.finanzas.domain.model.HistorialPago;
import com.omnis.saas.finanzas.domain.ports.out.HistorialPagoRepositoryPort;
import com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.mapper.HistorialPagoMapper;
import com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.repository.HistorialPagoJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class HistorialPagoRepositoryAdapter implements HistorialPagoRepositoryPort {

    private final HistorialPagoJpaRepository repository;
    private final HistorialPagoMapper mapper;

    @Override
    public HistorialPago guardar(HistorialPago historial) {
        var entity = mapper.toEntity(historial);
        var savedEntity = repository.save(entity);
        return mapper.toDomain(savedEntity);
    }
    public List<HistorialPago> buscarPorEstudiante(Long estudianteId) {
        return repository.findByEstudianteIdOrderByFechaOperacionDesc(estudianteId)
                .stream()
                .map(mapper::toDomain)
                .toList();
    }
}