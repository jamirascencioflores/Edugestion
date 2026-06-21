package com.omnis.saas.auth.domain.ports.out;

import com.omnis.saas.auth.domain.model.Usuario;

public interface TokenProviderPort {
    String generarToken(Usuario usuario);
}