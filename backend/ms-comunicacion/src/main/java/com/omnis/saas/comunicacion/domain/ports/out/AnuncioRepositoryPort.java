package com.omnis.saas.comunicacion.domain.ports.out;

import com.omnis.saas.comunicacion.domain.model.Anuncio;
import java.util.List;
import java.util.Optional;

public interface AnuncioRepositoryPort {
    Anuncio guardar(Anuncio anuncio);
    List<Anuncio> listarPorColegio(Long colegioId);
    Optional<Anuncio> buscarPorId(Long id);
}