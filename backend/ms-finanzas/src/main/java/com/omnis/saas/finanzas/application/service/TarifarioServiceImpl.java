package com.omnis.saas.finanzas.application.service;

import com.omnis.saas.finanzas.domain.model.Tarifario;
import com.omnis.saas.finanzas.domain.ports.in.TarifarioUseCase;
import com.omnis.saas.finanzas.domain.ports.out.TarifarioRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TarifarioServiceImpl implements TarifarioUseCase {

    private final TarifarioRepositoryPort repositoryPort;

    @Override
    public Tarifario crearTarifario(Tarifario tarifario) {
        tarifario.setEstado(true); // Activo por defecto
        return repositoryPort.save(tarifario);
    }

    @Override
    public List<Tarifario> obtenerPorAnio(Long colegioId, Integer anioEscolar) {
        return repositoryPort.findByColegioIdAndAnioEscolar(colegioId, anioEscolar);
    }
}