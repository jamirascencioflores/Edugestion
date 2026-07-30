package com.omnis.saas.finanzas.application.service;

import com.omnis.saas.finanzas.domain.model.EstadoDeuda;
import com.omnis.saas.finanzas.domain.model.Tarifario;
import com.omnis.saas.finanzas.domain.ports.in.GenerarDeudasEstudianteUseCase;
import com.omnis.saas.finanzas.domain.ports.out.TarifarioRepositoryPort;
import com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.entity.DeudaEntity;
import com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.repository.DeudaJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GenerarDeudasEstudianteServiceImpl implements GenerarDeudasEstudianteUseCase {

    private final TarifarioRepositoryPort tarifarioRepositoryPort;
    private final DeudaJpaRepository deudaJpaRepository;

    @Override
    @Transactional
    public void generarPensionesAnuales(Long colegioId, Long estudianteId, Long gradoId, Integer anioEscolar, LocalDate fechaInscripcion) {
        boolean yaTieneDeudas = !deudaJpaRepository.findByColegioIdAndEstudianteId(colegioId, estudianteId).isEmpty();
        if (yaTieneDeudas) return;

        Tarifario tarifario = tarifarioRepositoryPort.findByColegioIdAndAnioEscolar(colegioId, anioEscolar).stream()
                .filter(t -> t.getGradoId().equals(gradoId))
                .findFirst()
                .orElse(null);

        BigDecimal montoMensual = (tarifario != null) ? tarifario.getMontoMensual() : new BigDecimal("350.00");

        List<DeudaEntity> deudasAGenerar = new ArrayList<>();
        String[] meses = {"Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"};

        for (int i = 0; i < meses.length; i++) {
            int mesNum = i + 3;
            DeudaEntity deuda = DeudaEntity.builder()
                    .colegioId(colegioId)
                    .estudianteId(estudianteId)
                    .concepto("Pensión " + meses[i] + " " + anioEscolar)
                    .monto(montoMensual)
                    .fechaVencimiento(LocalDate.of(anioEscolar, mesNum, 5))
                    .estado(EstadoDeuda.PENDIENTE)
                    .build();

            deudasAGenerar.add(deuda);
        }

        deudaJpaRepository.saveAll(deudasAGenerar);
    }
}