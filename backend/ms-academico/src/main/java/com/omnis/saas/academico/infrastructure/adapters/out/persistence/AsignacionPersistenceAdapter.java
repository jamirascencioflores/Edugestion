package com.omnis.saas.academico.infrastructure.adapters.out.persistence;

import com.omnis.saas.academico.domain.model.Asignacion;
import com.omnis.saas.academico.domain.ports.out.AsignacionRepositoryPort;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper.AsignacionMapper;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.AsignacionJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AsignacionPersistenceAdapter implements AsignacionRepositoryPort {

    private final AsignacionJpaRepository repository;
    private final AsignacionMapper mapper;

    @Override
    public Asignacion guardar(Asignacion asignacion) {
        var entity = mapper.toEntity(asignacion);
        return mapper.toDomain(repository.save(entity));
    }

    @Override
    public List<Asignacion> buscarPorSeccion(Long seccionId) {
        return repository.findBySeccionIdOrderByCursoIdAsc(seccionId)
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public Asignacion buscarPorId(Long id) {
        return repository.findById(id).map(mapper::toDomain)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada"));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<Asignacion> buscarPorDocente(String docenteId) {
        return repository.findByDocenteId(docenteId).stream()
                .map(mapper::toDomain).toList();
    }
}