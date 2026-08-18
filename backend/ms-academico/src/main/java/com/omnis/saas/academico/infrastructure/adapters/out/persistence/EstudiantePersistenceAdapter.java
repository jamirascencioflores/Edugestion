package com.omnis.saas.academico.infrastructure.adapters.out.persistence;

import com.omnis.saas.academico.domain.model.Estudiante;
import com.omnis.saas.academico.domain.ports.out.EstudianteRepositoryPort;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper.EstudianteMapper;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.EstudianteJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class EstudiantePersistenceAdapter implements EstudianteRepositoryPort {

    private final EstudianteJpaRepository repository;
    private final EstudianteMapper mapper;

    @Override
    public Estudiante guardar(Estudiante estudiante) {
        return mapper.toDomain(repository.save(mapper.toEntity(estudiante)));
    }

    @Override
    public Optional<Estudiante> buscarPorId(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Estudiante> buscarTodos() {
        return repository.findAll().stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public List<Estudiante> buscarPorSeccion(Long seccionId) {
        return repository.findBySeccionId(seccionId)
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public void eliminarPorId(Long id) {
        repository.deleteById(id);
    }
}