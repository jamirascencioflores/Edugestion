package com.omnis.saas.academico.infrastructure.adapters.out.persistence;

import com.omnis.saas.academico.domain.model.Periodo;
import com.omnis.saas.academico.domain.ports.out.PeriodoRepositoryPort;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.PeriodoEntity;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper.PeriodoMapper;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.PeriodoJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PeriodoPersistenceAdapter implements PeriodoRepositoryPort {

    private final PeriodoJpaRepository repository;
    private final PeriodoMapper mapper;

    @Override
    public Periodo guardar(Periodo periodo) {
        PeriodoEntity entity = mapper.toEntity(periodo);
        return mapper.toDomain(repository.save(entity));
    }

    @Override
    public List<Periodo> guardarTodos(List<Periodo> periodos) {
        List<PeriodoEntity> entities = periodos.stream().map(mapper::toEntity).toList();
        return repository.saveAll(entities).stream().map(mapper::toDomain).toList();
    }

    @Override
    public List<Periodo> buscarTodos() {
        return repository.findAllByOrderByFechaInicioAsc().stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public List<Periodo> buscarPorColegioId(Long colegioId) {
        return repository.findByColegioIdOrderByFechaInicioAsc(colegioId).stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Periodo> buscarPorId(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public void eliminarPorId(Long id) {
        repository.deleteById(id);
    }


}