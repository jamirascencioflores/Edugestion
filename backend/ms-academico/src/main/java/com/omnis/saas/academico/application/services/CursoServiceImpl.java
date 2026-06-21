package com.omnis.saas.academico.application.services;

import com.omnis.saas.academico.domain.model.Curso;
import com.omnis.saas.academico.domain.ports.in.CursoUseCase;
import com.omnis.saas.academico.domain.ports.out.CursoRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CursoServiceImpl implements CursoUseCase {
    private final CursoRepositoryPort repositoryPort;
    @Override public Curso registrar(Curso curso) { return repositoryPort.guardar(curso); }

    @Transactional(readOnly = true)
    @Override public List<Curso> listar() { return repositoryPort.buscarTodos(); }

    @Transactional(readOnly = true)
    @Override
    public Curso buscarPorId(Long id) {
        return repositoryPort.buscarPorId(id);
    }

    @Transactional
    @Override
    public Curso actualizar(Long id, Curso cursoActualizado) {
        Curso cursoExistente = buscarPorId(id);
        cursoExistente.setNombre(cursoActualizado.getNombre());
        cursoExistente.setDescripcion(cursoActualizado.getDescripcion());
        cursoExistente.setEstado(cursoActualizado.getEstado());
        return repositoryPort.guardar(cursoExistente);
    }

    @Transactional
    @Override
    public void eliminar(Long id) {
        // Validar si existe primero
        buscarPorId(id);
        repositoryPort.eliminar(id);
    }
}