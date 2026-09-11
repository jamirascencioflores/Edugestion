package com.omnis.saas.academico.application.services;

import com.omnis.saas.academico.domain.model.Estudiante;
import com.omnis.saas.academico.domain.ports.in.EstudianteUseCase;
import com.omnis.saas.academico.domain.ports.out.EstudianteRepositoryPort;
import com.omnis.saas.academico.domain.ports.out.EstudianteEventPublisherPort;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.EstudianteActualizarDTO;
import com.omnis.saas.academico.infrastructure.adapters.out.feign.AuthFeignClient;
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
    private final AuthFeignClient authDocenteFeignClient;

    @Override
    @Transactional
    public Estudiante registrar(Estudiante estudiante, Long gradoId, Integer anioEscolar, LocalDate fechaInscripcion) {
        Long colegioId = estudiante.getColegioId();

        // 1. Validar límite del plan SaaS
        long totalActual = repositoryPort.contarPorColegioId(colegioId);
        Integer limitePermitido = authDocenteFeignClient.obtenerLimiteAlumnos(colegioId); // 👈 Usas el método aquí

        if (limitePermitido != null && totalActual >= limitePermitido) {
            throw new IllegalStateException("Has alcanzado el límite máximo de " + limitePermitido + " alumnos permitido por tu suscripción.");
        }

        // 2. Guardar y emitir evento
        Estudiante estudianteGuardado = repositoryPort.guardar(estudiante);
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

        Boolean estadoAnterior = existente.getEstado();

        existente.setNombres(dto.nombres());
        existente.setApellidos(dto.apellidos());
        existente.setDni(dto.dni());
        existente.setFechaNacimiento(dto.fechaNacimiento());
        existente.setFechaInscripcion(dto.fechaInscripcion()); // 👈 ASIGNACIÓN AGREGADA
        existente.setEmailInstitucional(dto.emailInstitucional());
        existente.setSeccionId(dto.seccionId());
        existente.setEstado(dto.estado());
        existente.setApoderadoIds(dto.apoderadoIds() != null ? dto.apoderadoIds() : List.of());

        // Actualización de datos del apoderado
        existente.setNombreApoderado(dto.nombreApoderado());
        existente.setDniApoderado(dto.dniApoderado());
        existente.setTelefonoApoderado(dto.telefonoApoderado());
        existente.setParentescoApoderado(dto.parentescoApoderado());

        Estudiante actualizado = repositoryPort.guardar(existente);

        if (Boolean.TRUE.equals(estadoAnterior) && Boolean.FALSE.equals(dto.estado())) {
            eventPublisher.publicarAlumnoRetirado(colegioId, id);
        } else if (Boolean.FALSE.equals(estadoAnterior) && Boolean.TRUE.equals(dto.estado())) {
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

    @Transactional(readOnly = true)
    @Override
    public Estudiante buscarPorId(Long id) {
        return repositoryPort.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado con ID: " + id));
    }
}