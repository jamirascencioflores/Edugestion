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
        tarifario.setEstado(true);
        return repositoryPort.save(tarifario);
    }

    @Override
    public List<Tarifario> obtenerPorAnio(Long colegioId, Integer anioEscolar) {
        return repositoryPort.findByColegioIdAndAnioEscolar(colegioId, anioEscolar);
    }

    @Override
    public Tarifario actualizarTarifario(Long id, Long colegioId, Tarifario tarifarioActualizado) {
        Tarifario existente = repositoryPort.findByIdAndColegioId(id, colegioId)
                .orElseThrow(() -> new RuntimeException("Tarifario no encontrado"));

        existente.setGradoId(tarifarioActualizado.getGradoId());
        existente.setMontoMensual(tarifarioActualizado.getMontoMensual());
        existente.setAnioEscolar(tarifarioActualizado.getAnioEscolar());
        existente.setTipoTarifa(tarifarioActualizado.getTipoTarifa());

        return repositoryPort.save(existente);
    }

    @Override
    public void cambiarEstado(Long id, Long colegioId, Boolean estado) {
        Tarifario existente = repositoryPort.findByIdAndColegioId(id, colegioId)
                .orElseThrow(() -> new RuntimeException("Tarifario no encontrado"));

        existente.setEstado(estado);
        repositoryPort.save(existente);
    }
}