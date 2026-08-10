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

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GenerarDeudasEstudianteServiceImpl implements GenerarDeudasEstudianteUseCase {

    private final TarifarioRepositoryPort tarifarioRepositoryPort;
    private final DeudaJpaRepository deudaJpaRepository;

    private static final String[] MESES = {
            "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    };

    @Override
    @Transactional
    public void generarPensionesAnuales(Long colegioId, Long estudianteId, Long gradoId, Integer anioEscolar, LocalDate fechaInscripcion) {
        // 1. Obtener todas las deudas existentes del alumno para no duplicar
        List<DeudaEntity> deudasExistentes = deudaJpaRepository.findByColegioIdAndEstudianteId(colegioId, estudianteId);

        // 2. Cargar los tarifarios activos configurados para este grado y año
        List<Tarifario> tarifarios = tarifarioRepositoryPort.findByColegioIdAndAnioEscolar(colegioId, anioEscolar)
                .stream()
                .filter(t -> t.getGradoId().equals(gradoId) && Boolean.TRUE.equals(t.getEstado()))
                .toList();

        Tarifario tarifaMatricula = tarifarios.stream()
                .filter(t -> "MATRICULA".equalsIgnoreCase(t.getTipoTarifa()))
                .findFirst()
                .orElse(null);

        Tarifario tarifaPension = tarifarios.stream()
                .filter(t -> "PENSION".equalsIgnoreCase(t.getTipoTarifa()))
                .findFirst()
                .orElse(null);

        List<DeudaEntity> deudasAGenerar = new ArrayList<>();

        // 3. Evaluar y generar MATRÍCULA (si está configurada y el alumno aún no la tiene)
        if (tarifaMatricula != null) {
            boolean yaExisteMatricula = deudasExistentes.stream()
                    .anyMatch(d -> d.getConcepto() != null && d.getConcepto().toLowerCase().contains("matrícula"));

            if (!yaExisteMatricula) {
                LocalDate fechaVencMatricula = (fechaInscripcion != null) ? fechaInscripcion : LocalDate.now();
                DeudaEntity deudaMatricula = DeudaEntity.builder()
                        .colegioId(colegioId)
                        .estudianteId(estudianteId)
                        .concepto("Matrícula " + anioEscolar)
                        .monto(tarifaMatricula.getMontoMensual())
                        .fechaVencimiento(fechaVencMatricula)
                        .estado(EstadoDeuda.PENDIENTE)
                        .build();
                deudasAGenerar.add(deudaMatricula);
            }
        }

        // 4. Evaluar y generar PENSIONES MENSUALES (si están configuradas)
        if (tarifaPension != null) {
            for (int i = 0; i < MESES.length; i++) {
                String conceptoPension = "Pensión " + MESES[i] + " - " + anioEscolar;
                int mesNum = i + 3; // Marzo es mes 3

                boolean yaExistePension = deudasExistentes.stream()
                        .anyMatch(d -> d.getConcepto() != null && d.getConcepto().equalsIgnoreCase(conceptoPension));

                if (!yaExistePension) {
                    DeudaEntity deuda = DeudaEntity.builder()
                            .colegioId(colegioId)
                            .estudianteId(estudianteId)
                            .concepto(conceptoPension)
                            .monto(tarifaPension.getMontoMensual())
                            .fechaVencimiento(LocalDate.of(anioEscolar, mesNum, 5))
                            .estado(EstadoDeuda.PENDIENTE)
                            .build();

                    deudasAGenerar.add(deuda);
                }
            }
        }

        // 5. Guardar únicamente los nuevos conceptos faltantes
        if (!deudasAGenerar.isEmpty()) {
            deudaJpaRepository.saveAll(deudasAGenerar);
        }
    }
}