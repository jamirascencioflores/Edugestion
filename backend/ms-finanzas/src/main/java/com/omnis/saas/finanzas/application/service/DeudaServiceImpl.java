package com.omnis.saas.finanzas.application.service;

import com.omnis.saas.finanzas.domain.model.Deuda;
import com.omnis.saas.finanzas.domain.model.EstadoDeuda;
import com.omnis.saas.finanzas.domain.model.Tarifario;
import com.omnis.saas.finanzas.domain.ports.in.DeudaUseCase;
import com.omnis.saas.finanzas.domain.ports.out.DeudaRepositoryPort;
import com.omnis.saas.finanzas.domain.ports.out.TarifarioRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeudaServiceImpl implements DeudaUseCase {

    private final DeudaRepositoryPort deudaRepository;
    private final TarifarioRepositoryPort tarifarioRepository;

    private static final String[] MESES = {"Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"};

    @Override
    @Transactional
    public void generarCuotasAnuales(Long colegioId, Long estudianteId, Long gradoId, Integer anioEscolar) {
        Tarifario tarifario = tarifarioRepository.findByColegioIdAndAnioEscolar(colegioId, anioEscolar)
                .stream()
                .filter(t -> t.getGradoId().equals(gradoId) && t.getEstado())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Tarifario no encontrado para el grado"));

        List<Deuda> deudas = new ArrayList<>();

        for (int i = 0; i < 10; i++) {
            deudas.add(Deuda.builder()
                    .colegioId(colegioId)
                    .estudianteId(estudianteId)
                    .concepto("Pensión " + MESES[i] + " - " + anioEscolar)
                    .monto(tarifario.getMontoMensual())
                    .fechaVencimiento(LocalDate.of(anioEscolar, i + 3, 5))
                    .estado(EstadoDeuda.PENDIENTE)
                    .build());
        }

        deudaRepository.saveAll(deudas);
    }

    @Override
    public List<Deuda> obtenerPorEstudiante(Long colegioId, Long estudianteId) {
        return deudaRepository.findByColegioIdAndEstudianteId(colegioId, estudianteId);
    }

    @Override
    @Transactional
    public void anularDeuda(Long colegioId, Long deudaId) {
        Deuda deuda = deudaRepository.buscarPorId(deudaId)
                .orElseThrow(() -> new RuntimeException("Deuda no encontrada"));

        if (!deuda.getColegioId().equals(colegioId)) {
            throw new RuntimeException("No tiene permisos para anular esta deuda");
        }

        if (deuda.getEstado() == EstadoDeuda.PAGADA) {
            throw new RuntimeException("No se puede anular una deuda que ya ha sido pagada");
        }

        deuda.setEstado(EstadoDeuda.ANULADA);
        deudaRepository.guardar(deuda);
    }

    @Override
    @Transactional
    public void pagarDeuda(Long id, String numeroOperacion) {
        Deuda deuda = deudaRepository.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Deuda no encontrada"));

        deuda.setEstado(EstadoDeuda.PAGADA);
        deuda.setNumeroOperacion(numeroOperacion);
        deudaRepository.guardar(deuda);
    }

    @Override
    @Transactional
    public void revertirPago(Long id, String motivo) {
        Deuda deuda = deudaRepository.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Deuda no encontrada"));

        if (deuda.getEstado() != EstadoDeuda.PAGADA) {
            throw new RuntimeException("Solo se pueden revertir deudas pagadas");
        }

        deuda.setEstado(EstadoDeuda.PENDIENTE);
        deuda.setNumeroOperacion(null);
        deuda.setMotivoReversion(motivo);
        deudaRepository.guardar(deuda);
    }

    // 👇 Implementación del nuevo método requerido por la interfaz
    @Override
    @Transactional
    public void anularCuotasPendientes(Long colegioId, Long estudianteId) {
        List<Deuda> pendientes = deudaRepository.buscarPendientesPorEstudiante(colegioId, estudianteId);

        pendientes.forEach(deuda -> {
            deuda.setEstado(EstadoDeuda.ANULADA);
            deuda.setMotivoReversion("Alumno Retirado");
        });

        deudaRepository.saveAll(pendientes);
    }

    @Override
    @Transactional
    public void reactivarCuotasAnuladas(Long colegioId, Long estudianteId) {
        List<Deuda> anuladas = deudaRepository.buscarAnuladasPorRetiro(colegioId, estudianteId);

        anuladas.forEach(deuda -> {
            deuda.setEstado(EstadoDeuda.PENDIENTE);
            deuda.setMotivoReversion(null); // Limpiamos el motivo
        });

        deudaRepository.saveAll(anuladas);
    }
}