package com.omnis.saas.academico.application.services;

import com.omnis.saas.academico.domain.model.Asignacion;
import com.omnis.saas.academico.domain.ports.in.AsignacionUseCase;
import com.omnis.saas.academico.domain.ports.out.AsignacionRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AsignacionServiceImpl implements AsignacionUseCase {

    private final AsignacionRepositoryPort repositoryPort;

    @Transactional
    @Override
    public Asignacion registrar(Asignacion asignacion) {
        return repositoryPort.guardar(asignacion);
    }

    @Transactional(readOnly = true)
    @Override
    public List<Asignacion> listarPorSeccion(Long seccionId) {
        return repositoryPort.buscarPorSeccion(seccionId);
    }

    @Transactional(readOnly = true)
    @Override
    public Asignacion buscarPorId(Long id) {
        return repositoryPort.buscarPorId(id);
    }

    @Transactional
    @Override
    public Asignacion actualizar(Long id, Asignacion actualizada) {
        Asignacion existente = buscarPorId(id);
        existente.setDocenteId(actualizada.getDocenteId());
        existente.setEstado(actualizada.getEstado());
        return repositoryPort.guardar(existente);
    }

    @Transactional
    @Override
    public void eliminar(Long id) {
        buscarPorId(id);
        repositoryPort.eliminar(id);
    }

    @Transactional(readOnly = true)
    @Override
    public List<Asignacion> listarPorDocente(String docenteId) {
        return repositoryPort.buscarPorDocente(docenteId);
    }
}