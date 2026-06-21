package com.omnis.saas.academico.infrastructure.adapters.out.persistence;

import com.omnis.saas.academico.domain.model.Calificacion;
import com.omnis.saas.academico.domain.ports.out.CalificacionRepositoryPort;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper.CalificacionMapper;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.CalificacionJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CalificacionPersistenceAdapter implements CalificacionRepositoryPort {

    private final CalificacionJpaRepository repository;
    private final CalificacionMapper mapper;

    @Override
    public Calificacion guardar(Calificacion calificacion) {
        return mapper.toDomain(repository.save(mapper.toEntity(calificacion)));
    }

    @Override
    public List<Calificacion> buscarPorCursoYPeriodo(Long colegioId, Long cursoId, String periodo) {
        return repository.findByColegioIdAndCursoIdAndPeriodo(colegioId, cursoId, periodo)
                .stream().map(mapper::toDomain).toList();
    }

    @Override
    public List<Calificacion> buscarPorEstudianteYPeriodo(Long colegioId, Long estudianteId, String periodo) {
        return repository.findByColegioIdAndEstudianteIdAndPeriodo(colegioId, estudianteId, periodo)
                .stream().map(mapper::toDomain).toList();
    }

    @Override
    public List<Calificacion> buscarPorCurso(Long colegioId, Long cursoId) {
        return repository.findByColegioIdAndCursoId(colegioId, cursoId)
                .stream().map(mapper::toDomain).toList();
    }
}