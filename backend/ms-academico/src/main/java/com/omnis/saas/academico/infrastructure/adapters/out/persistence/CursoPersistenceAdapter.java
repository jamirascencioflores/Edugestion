package com.omnis.saas.academico.infrastructure.adapters.out.persistence;

import com.omnis.saas.academico.domain.model.Curso;
import com.omnis.saas.academico.domain.ports.out.CursoRepositoryPort;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper.CursoMapper;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.CursoJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CursoPersistenceAdapter implements CursoRepositoryPort { // 👈 QUITA "CursoOutputPort" de aquí

    private final CursoJpaRepository repository;
    private final CursoMapper mapper;

    @Override
    public Curso guardar(Curso curso) {
        return mapper.toDomain(repository.save(mapper.toEntity(curso)));
    }

    @Override
    public List<Curso> buscarTodos() {
        return repository.findAllByOrderByNombreAsc().stream()
                .map(mapper::toDomain).toList();
    }

    @Override
    public Curso buscarPorId(Long id) {
        return repository.findById(id)
                .map(mapper::toDomain)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}