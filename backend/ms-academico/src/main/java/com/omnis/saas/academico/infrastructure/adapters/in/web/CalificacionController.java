package com.omnis.saas.academico.infrastructure.adapters.in.web;

import com.omnis.saas.academico.application.services.ReporteServiceImpl;
import com.omnis.saas.academico.domain.model.Calificacion;
import com.omnis.saas.academico.domain.ports.in.CalificacionUseCase;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.CalificacionRegistroDTO;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.CalificacionReporteDTO;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.CalificacionResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academicos/calificaciones")
@RequiredArgsConstructor
public class CalificacionController {

    private final CalificacionUseCase calificacionUseCase;
    private final ReporteServiceImpl reporteService;

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

    // Nuevo endpoint para generar el PDF
    @GetMapping("/estudiante/{estudianteId}/boleta/pdf")
    public ResponseEntity<byte[]> descargarBoleta(
            @RequestHeader("X-Colegio-Id") Long colegioId,
            @PathVariable Long estudianteId,
            @RequestParam String periodo) {

        // 1. Obtener notas
        List<Calificacion> calificaciones = calificacionUseCase.listarPorEstudiante(colegioId, estudianteId, periodo);

        // 2. Mapear a DTO de Reporte (Temporalmente concatenamos IDs hasta cruzar con las tablas de Estudiante y Curso)
        List<CalificacionReporteDTO> notasReporte = calificaciones.stream()
                .map(c -> new CalificacionReporteDTO(
                        "Curso ID: " + c.getCursoId(),
                        c.getValor(),
                        c.getComentario() != null ? c.getComentario() : ""
                )).toList();

        // 3. Generar PDF
        byte[] pdfBytes = reporteService.generarBoletaNotasPdf(
                "Estudiante ID: " + estudianteId,
                "Grado y Sección",
                periodo,
                notasReporte
        );

        // 4. Configurar respuesta para descarga
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "boleta_notas_" + periodo + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

    @PostMapping("/masivo")
    public ResponseEntity<List<CalificacionResponseDTO>> registrarMasivo(
            @RequestHeader("X-Colegio-Id") Long colegioId,
            @Valid @RequestBody List<CalificacionRegistroDTO> dtos) {

        // 1. Transformar los DTOs a modelos de Dominio
        List<Calificacion> calificaciones = dtos.stream()
                .map(dto -> Calificacion.builder()
                        .colegioId(colegioId)
                        .estudianteId(dto.estudianteId())
                        .cursoId(dto.cursoId())
                        .docenteId(dto.docenteId())
                        .periodo(dto.periodo())
                        .valor(dto.valor())
                        .comentario(dto.comentario())
                        .build())
                .toList();

        // 2. Llamar al caso de uso pasándole el único argumento esperado
        List<Calificacion> guardadas = calificacionUseCase.registrarMasivo(calificaciones);

        // 3. Devolver la respuesta
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(guardadas.stream().map(this::mapToDTO).toList());
    }
}