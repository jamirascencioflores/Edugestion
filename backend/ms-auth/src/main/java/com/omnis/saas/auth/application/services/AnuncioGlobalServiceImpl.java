package com.omnis.saas.auth.application.services;

import com.omnis.saas.auth.domain.model.AnuncioGlobal;
import com.omnis.saas.auth.domain.ports.in.AnuncioGlobalUseCase;
import com.omnis.saas.auth.domain.ports.out.AnuncioGlobalRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnuncioGlobalServiceImpl implements AnuncioGlobalUseCase {

    private final AnuncioGlobalRepositoryPort anuncioRepository;

    @Override
    public List<AnuncioGlobal> obtenerTodos() {
        return anuncioRepository.findAll();
    }

    @Override
    public List<AnuncioGlobal> obtenerActivos() {
        return anuncioRepository.findByActivoTrue();
    }

    @Override
    public AnuncioGlobal crear(AnuncioGlobal anuncio) {
        anuncio.setFechaCreacion(LocalDateTime.now());
        if (anuncio.getActivo() == null) {
            anuncio.setActivo(true);
        }
        return anuncioRepository.save(anuncio);
    }

    @Override
    public AnuncioGlobal actualizar(Long id, AnuncioGlobal actualizado) {
        AnuncioGlobal existente = anuncioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anuncio no encontrado con ID: " + id));

        existente.setTitulo(actualizado.getTitulo());
        existente.setMensaje(actualizado.getMensaje());
        existente.setTipo(actualizado.getTipo());
        existente.setFechaVencimiento(actualizado.getFechaVencimiento());

        return anuncioRepository.save(existente);
    }

    @Override
    public AnuncioGlobal cambiarEstado(Long id, Boolean activo) {
        AnuncioGlobal existente = anuncioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anuncio no encontrado con ID: " + id));

        existente.setActivo(activo);
        return anuncioRepository.save(existente);
    }

    @Override
    public void eliminar(Long id) {
        anuncioRepository.deleteById(id);
    }
}