package com.omnis.saas.academico.infrastructure.adapters.in.web;

import com.omnis.saas.academico.domain.model.Calificacion;
import com.omnis.saas.academico.domain.ports.in.CalificacionUseCase;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.CalificacionRegistroDTO;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.CalificacionResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academicos/calificaciones")
@RequiredArgsConstructor
public class CalificacionController {

    private final CalificacionUseCase calificacionUseCase;

    @PostMapping
    public ResponseEntity<CalificacionResponseDTO> registrar(
            @RequestHeader("X-Colegio-Id") Long colegioId,
            @Valid @RequestBody CalificacionRegistroDTO dto) {

        Calificacion nuevaCalificacion = Calificacion.builder()
                .colegioId(colegioId)
                .estudianteId(dto.estudianteId())
                .cursoId(dto.cursoId())
                .docenteId(dto.docenteId())
                .periodo(dto.periodo())
                .valor(dto.valor())
                .comentario(dto.comentario())
                .build();

        Calificacion guardada = calificacionUseCase.registrar(nuevaCalificacion);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(guardada));
    }

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<CalificacionResponseDTO>> listarPorCurso(
            @RequestHeader("X-Colegio-Id") Long colegioId,
            @PathVariable Long cursoId,
            @RequestParam String periodo) {

        List<Calificacion> calificaciones = calificacionUseCase.listarPorCurso(colegioId, cursoId, periodo);
        return ResponseEntity.ok(calificaciones.stream().map(this::mapToDTO).toList());
    }

    @GetMapping("/estudiante/{estudianteId}")
    public ResponseEntity<List<CalificacionResponseDTO>> listarPorEstudiante(
            @RequestHeader("X-Colegio-Id") Long colegioId,
            @PathVariable Long estudianteId,
            @RequestParam String periodo) {

        List<Calificacion> calificaciones = calificacionUseCase.listarPorEstudiante(colegioId, estudianteId, periodo);
        return ResponseEntity.ok(calificaciones.stream().map(this::mapToDTO).toList());
    }

    // Método auxiliar para mapear de Dominio a DTO de respuesta
    private CalificacionResponseDTO mapToDTO(Calificacion calificacion) {
        return new CalificacionResponseDTO(
                calificacion.getId(),
                calificacion.getEstudianteId(),
                calificacion.getCursoId(),
                calificacion.getDocenteId(),
                calificacion.getPeriodo(),
                calificacion.getValor(),
                calificacion.getComentario(),
                calificacion.getFechaRegistro()
        );
    }

    @GetMapping("/curso/{cursoId}/todos")
    public ResponseEntity<List<CalificacionResponseDTO>> listarPorCursoTodosPeriodos(
            @RequestHeader("X-Colegio-Id") Long colegioId,
            @PathVariable Long cursoId) {

        List<Calificacion> calificaciones = calificacionUseCase.listarPorCursoTodosPeriodos(colegioId, cursoId);
        return ResponseEntity.ok(calificaciones.stream().map(this::mapToDTO).toList());
    }
}