package com.omnis.saas.comunicacion.application.service;

import com.omnis.saas.comunicacion.domain.model.Anuncio;
import com.omnis.saas.comunicacion.domain.ports.in.AnuncioUseCase;
import com.omnis.saas.comunicacion.domain.ports.out.AnuncioRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnuncioServiceImpl implements AnuncioUseCase {

    private final AnuncioRepositoryPort repositoryPort;

    @Override
    @Transactional
    public Anuncio crear(Anuncio anuncio) {
        anuncio.setFechaPublicacion(LocalDateTime.now());
        anuncio.setEstado(true);
        return repositoryPort.guardar(anuncio);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Anuncio> listar(Long colegioId) {
        return repositoryPort.listarPorColegio(colegioId);
    }

    @Override
    @Transactional
    public void eliminar(Long id, Long colegioId) {
        Anuncio existente = repositoryPort.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Anuncio no encontrado"));

        if (!existente.getColegioId().equals(colegioId)) {
            throw new RuntimeException("Sin permisos para eliminar este anuncio");
        }

        existente.setEstado(false); // Borrado lógico
        repositoryPort.guardar(existente);
    }
}