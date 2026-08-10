package com.omnis.saas.academico.application.services;

import com.omnis.saas.academico.domain.model.Asignacion;
import com.omnis.saas.academico.domain.ports.in.AsignacionUseCase;
import com.omnis.saas.academico.domain.ports.out.AsignacionRepositoryPort;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.AsignacionClonarDTO;
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

    @Override
    @Transactional
    public void clonarMalla(AsignacionClonarDTO dto, Long colegioId) {
        // 1. Obtener los cursos asignados en la sección de origen
        List<Asignacion> asignacionesOrigen = repositoryPort.buscarPorSeccion(dto.seccionOrigenId());

        if (asignacionesOrigen.isEmpty()) {
            throw new IllegalArgumentException("La sección de origen no tiene cursos asignados.");
        }

        // 2. Para cada sección destino, clonar los cursos
        for (Long seccionDestinoId : dto.seccionesDestinoIds()) {
            // Evitar clonarse sobre sí misma
            if (seccionDestinoId.equals(dto.seccionOrigenId())) continue;

            // Obtener asignaciones existentes en el destino para evitar duplicados por la constraint unique(seccion_id, curso_id)
            List<Asignacion> asignacionesDestino = repositoryPort.buscarPorSeccion(seccionDestinoId);
            List<Long> cursosYaAsignados = asignacionesDestino.stream()
                    .map(Asignacion::getCursoId)
                    .toList();

            for (Asignacion orig : asignacionesOrigen) {
                // Si el curso ya está en la sección destino, lo omitimos
                if (cursosYaAsignados.contains(orig.getCursoId())) continue;

                String docenteIdFinal = Boolean.TRUE.equals(dto.incluirDocentes()) ? orig.getDocenteId() : "";

                Asignacion nuevaAsignacion = Asignacion.builder()
                        .seccionId(seccionDestinoId)
                        .cursoId(orig.getCursoId())
                        .docenteId(docenteIdFinal)
                        .colegioId(colegioId)
                        .estado(true)
                        .build();

                repositoryPort.guardar(nuevaAsignacion);
            }
        }
    }
}