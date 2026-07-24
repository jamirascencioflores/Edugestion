package com.omnis.saas.academico.application.services;

import com.omnis.saas.academico.domain.model.Estudiante;
import com.omnis.saas.academico.domain.ports.in.EstudianteUseCase;
import com.omnis.saas.academico.domain.ports.out.EstudianteRepositoryPort;
import com.omnis.saas.academico.domain.ports.out.EstudianteEventPublisherPort;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.EstudianteActualizarDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EstudianteServiceImpl implements EstudianteUseCase {
    private final EstudianteRepositoryPort repositoryPort;
    private final EstudianteEventPublisherPort eventPublisher;

    @Override
    @Transactional
    public Estudiante registrar(Estudiante estudiante, Long gradoId, Integer anioEscolar, LocalDate fechaInscripcion) { // <-- Parámetro añadido
        Estudiante estudianteGuardado = repositoryPort.guardar(estudiante);
        // Pasamos la fecha al publicador de eventos
        eventPublisher.publicarAlumnoRegistrado(estudianteGuardado, gradoId, anioEscolar, fechaInscripcion);
        return estudianteGuardado;
    }

    @Transactional(readOnly = true)
    @Override
    public List<Estudiante> listar() {
        return repositoryPort.buscarTodos();
    }

    @Override
    @Transactional
    public Estudiante actualizar(Long id, EstudianteActualizarDTO dto, Long colegioId) {
        Estudiante existente = repositoryPort.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

        if (!existente.getColegioId().equals(colegioId)) {
            throw new RuntimeException("Sin permisos para modificar este estudiante");
        }

        // 1. Guardamos el estado anterior como Boolean
        Boolean estadoAnterior = existente.getEstado();

        existente.setNombres(dto.nombres());
        existente.setApellidos(dto.apellidos());
        existente.setDni(dto.dni());
        existente.setFechaNacimiento(dto.fechaNacimiento());
        existente.setEmailInstitucional(dto.emailInstitucional());
        existente.setSeccionId(dto.seccionId());
        existente.setEstado(dto.estado());
        existente.setApoderadoIds(dto.apoderadoIds() != null ? dto.apoderadoIds() : List.of());

        Estudiante actualizado = repositoryPort.guardar(existente);

        // 2. Si el estado cambió de true (Activo) a false (Retirado), disparamos el evento
        if (Boolean.TRUE.equals(estadoAnterior) && Boolean.FALSE.equals(dto.estado())) {
            eventPublisher.publicarAlumnoRetirado(colegioId, id);
        }
        // Si el estado cambió de false (Retirado) a true (Activo)
        else if (Boolean.FALSE.equals(estadoAnterior) && Boolean.TRUE.equals(dto.estado())) {
            eventPublisher.publicarAlumnoReactivado(colegioId, id);
        }

        return actualizado;
    }

    @Override
    @Transactional
    public void eliminar(Long id, Long colegioId) {
        Estudiante existente = repositoryPort.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

        if (!existente.getColegioId().equals(colegioId)) {
            throw new RuntimeException("Sin permisos para eliminar este estudiante");
        }

        repositoryPort.eliminarPorId(id);
    }

    @Transactional(readOnly = true)
    @Override
    public List<Estudiante> listarPorSeccion(Long seccionId) {
        return repositoryPort.buscarPorSeccion(seccionId);
    }

    // 👇 MÉTODO AÑADIDO PARA SOPORTAR FEIGN
    @Transactional(readOnly = true)
    @Override
    public Estudiante buscarPorId(Long id) {
        return repositoryPort.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado con ID: " + id));
    }
}