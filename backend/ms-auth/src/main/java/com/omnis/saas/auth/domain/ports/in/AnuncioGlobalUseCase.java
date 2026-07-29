package com.omnis.saas.auth.domain.ports.in;

import com.omnis.saas.auth.domain.model.AnuncioGlobal;
import java.util.List;

public interface AnuncioGlobalUseCase {
    List<AnuncioGlobal> obtenerTodos();
    List<AnuncioGlobal> obtenerActivos();
    AnuncioGlobal crear(AnuncioGlobal anuncio);
    AnuncioGlobal actualizar(Long id, AnuncioGlobal anuncio);
    AnuncioGlobal cambiarEstado(Long id, Boolean activo);
    void eliminar(Long id);
}