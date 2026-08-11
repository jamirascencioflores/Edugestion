package com.omnis.saas.comunicacion.infrastructure.adapters.in.web;

import com.omnis.saas.comunicacion.domain.ports.in.AnuncioUseCase;
import com.omnis.saas.comunicacion.infrastructure.adapters.in.web.dto.AnuncioCrearDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comunicaciones/anuncios")
@RequiredArgsConstructor
public class AnuncioController {

    private final AnuncioUseCase anuncioService;

    @PostMapping
    public ResponseEntity<?> crear(
            @RequestHeader("X-Colegio-Id") Long colegioId,
            @RequestBody AnuncioCrearDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(anuncioService.crear(dto.toDomain(colegioId)));
    }

    @GetMapping
    public ResponseEntity<?> listar(@RequestHeader("X-Colegio-Id") Long colegioId) {
        return ResponseEntity.ok(anuncioService.listar(colegioId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @RequestHeader("X-Colegio-Id") Long colegioId,
            @PathVariable Long id) {
        anuncioService.eliminar(id, colegioId);
        return ResponseEntity.noContent().build();
    }
}