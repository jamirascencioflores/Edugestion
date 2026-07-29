package com.omnis.saas.auth.infrastructure.adapters.in.web;

import com.omnis.saas.auth.domain.model.AnuncioGlobal;
import com.omnis.saas.auth.domain.ports.in.AnuncioGlobalUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth/superadmin/anuncios")
@RequiredArgsConstructor
public class AnuncioGlobalController {

    private final AnuncioGlobalUseCase anuncioUseCase;

    @GetMapping
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<List<AnuncioGlobal>> obtenerTodos() {
        return ResponseEntity.ok(anuncioUseCase.obtenerTodos());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<AnuncioGlobal>> obtenerActivos() { // Endpoint libre/autenticado para que lo lean los portales de los colegios
        return ResponseEntity.ok(anuncioUseCase.obtenerActivos());
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<AnuncioGlobal> crear(@RequestBody AnuncioGlobal anuncio) {
        return ResponseEntity.status(HttpStatus.CREATED).body(anuncioUseCase.crear(anuncio));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<AnuncioGlobal> actualizar(@PathVariable Long id, @RequestBody AnuncioGlobal anuncio) {
        return ResponseEntity.ok(anuncioUseCase.actualizar(id, anuncio));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<AnuncioGlobal> cambiarEstado(@PathVariable Long id, @RequestParam Boolean activo) {
        return ResponseEntity.ok(anuncioUseCase.cambiarEstado(id, activo));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        anuncioUseCase.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}