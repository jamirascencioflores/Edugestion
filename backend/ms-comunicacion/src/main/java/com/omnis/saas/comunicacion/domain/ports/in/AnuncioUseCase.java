package com.omnis.saas.comunicacion.domain.ports.in;

import com.omnis.saas.comunicacion.domain.model.Anuncio;
import java.util.List;

public interface AnuncioUseCase {
    Anuncio crear(Anuncio anuncio);
    List<Anuncio> listar(Long colegioId);
    void eliminar(Long id, Long colegioId);
}