package com.omnis.saas.finanzas.application.service;

import com.omnis.saas.finanzas.domain.model.Tarifario;
import com.omnis.saas.finanzas.domain.ports.in.GenerarDeudasEstudianteUseCase;
import com.omnis.saas.finanzas.domain.ports.in.TarifarioUseCase;
import com.omnis.saas.finanzas.domain.ports.out.TarifarioRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TarifarioServiceImpl implements TarifarioUseCase {

    private final TarifarioRepositoryPort repositoryPort;
    private final GenerarDeudasEstudianteUseCase generarDeudasEstudianteUseCase;
    private final RestTemplate restTemplate;

    @Override
    @Transactional
    public Tarifario crearTarifario(Tarifario tarifario) {
        tarifario.setEstado(true);
        Tarifario guardado = repositoryPort.save(tarifario);

        // Sincronización retroactiva
        sincronizarDeudasRetroactivas(guardado.getColegioId(), guardado.getGradoId(), guardado.getAnioEscolar());

        return guardado;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Tarifario> obtenerPorAnio(Long colegioId, Integer anioEscolar) {
        return repositoryPort.findByColegioIdAndAnioEscolar(colegioId, anioEscolar);
    }

    @Override
    @Transactional
    public Tarifario actualizarTarifario(Long id, Long colegioId, Tarifario tarifarioActualizado) {
        Tarifario existente = repositoryPort.findByIdAndColegioId(id, colegioId)
                .orElseThrow(() -> new RuntimeException("Tarifario no encontrado"));

        existente.setGradoId(tarifarioActualizado.getGradoId());
        existente.setMontoMensual(tarifarioActualizado.getMontoMensual());
        existente.setAnioEscolar(tarifarioActualizado.getAnioEscolar());
        existente.setTipoTarifa(tarifarioActualizado.getTipoTarifa());

        Tarifario guardado = repositoryPort.save(existente);

        sincronizarDeudasRetroactivas(colegioId, guardado.getGradoId(), guardado.getAnioEscolar());

        return guardado;
    }

    @Override
    @Transactional
    public void cambiarEstado(Long id, Long colegioId, Boolean estado) {
        Tarifario existente = repositoryPort.findByIdAndColegioId(id, colegioId)
                .orElseThrow(() -> new RuntimeException("Tarifario no encontrado"));

        existente.setEstado(estado);
        repositoryPort.save(existente);
    }

    @Override
    @Transactional
    public void eliminarTarifario(Long id, Long colegioId) {
        repositoryPort.deleteByIdAndColegioId(id, colegioId);
    }

    // Método auxiliar para consultar alumnos de ms-academico y generarles sus deudas
    private void sincronizarDeudasRetroactivas(Long colegioId, Long gradoId, Integer anioEscolar) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Colegio-Id", String.valueOf(colegioId));
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<List<Long>> response = restTemplate.exchange(
                    "http://ms-academico/api/academicos/estudiantes/grado/" + gradoId + "/ids",
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<List<Long>>() {}
            );

            List<Long> estudianteIds = response.getBody();
            if (estudianteIds != null) {
                for (Long estudianteId : estudianteIds) {
                    generarDeudasEstudianteUseCase.generarPensionesAnuales(
                            colegioId,
                            estudianteId,
                            gradoId,
                            anioEscolar,
                            LocalDate.now()
                    );
                }
            }
        } catch (Exception e) {
            System.out.println("Aviso: No se pudieron sincronizar deudas retroactivas para el grado " + gradoId + ": " + e.getMessage());
        }
    }
}