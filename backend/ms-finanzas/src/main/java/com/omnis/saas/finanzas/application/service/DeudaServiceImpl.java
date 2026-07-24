package com.omnis.saas.finanzas.application.service;

import com.omnis.saas.finanzas.domain.model.Deuda;
import com.omnis.saas.finanzas.domain.model.EstadoDeuda;
import com.omnis.saas.finanzas.domain.model.HistorialPago;
import com.omnis.saas.finanzas.domain.model.Tarifario;
import com.omnis.saas.finanzas.domain.ports.in.DeudaUseCase;
import com.omnis.saas.finanzas.domain.ports.out.DeudaRepositoryPort;
import com.omnis.saas.finanzas.domain.ports.out.HistorialPagoRepositoryPort;
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
    private final HistorialPagoRepositoryPort historialPagoPort; // 👈 Inyectado para auditoría

    private static final String[] MESES = {"Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"};

    @Override
    @Transactional
    public void generarCuotasAnuales(Long colegioId, Long estudianteId, Long gradoId, Integer anioEscolar, LocalDate fechaInscripcion) {
        // Si aún no envías la fecha desde ms-academico, usamos la fecha actual por defecto
        if (fechaInscripcion == null) fechaInscripcion = LocalDate.now();

        int mesInicio = fechaInscripcion.getMonthValue();
        if (mesInicio < 3) mesInicio = 3; // Si se inscribe en enero/febrero, la pensión inicia en marzo

        List<Tarifario> tarifarios = tarifarioRepository.findByColegioIdAndAnioEscolar(colegioId, anioEscolar)
                .stream()
                .filter(t -> t.getGradoId().equals(gradoId) && t.getEstado())
                .toList();

        Tarifario tarifaPension = tarifarios.stream()
                .filter(t -> "PENSION".equals(t.getTipoTarifa()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Tarifario de PENSIÓN no encontrado para el grado"));

        Tarifario tarifaMatricula = tarifarios.stream()
                .filter(t -> "MATRICULA".equals(t.getTipoTarifa()))
                .findFirst()
                .orElse(null); // Puede ser null si el colegio no cobra matrícula

        List<Deuda> deudas = new ArrayList<>();

        // 1. Generar Deuda de Matrícula (Si existe tarifa configurada)
        if (tarifaMatricula != null) {
            deudas.add(Deuda.builder()
                    .colegioId(colegioId)
                    .estudianteId(estudianteId)
                    .concepto("Matrícula " + anioEscolar)
                    .monto(tarifaMatricula.getMontoMensual())
                    .fechaVencimiento(fechaInscripcion.plusDays(5)) // Vence 5 días después de la inscripción
                    .estado(EstadoDeuda.PENDIENTE)
                    .build());
        }

        // 2. Generar Deudas de Pensiones restantes (Desde el mes de ingreso hasta Diciembre)
        if (mesInicio <= 12) {
            for (int i = mesInicio; i <= 12; i++) {
                deudas.add(Deuda.builder()
                        .colegioId(colegioId)
                        .estudianteId(estudianteId)
                        .concepto("Pensión " + MESES[i - 3] + " - " + anioEscolar) // i=3 -> Índice 0 (Marzo)
                        .monto(tarifaPension.getMontoMensual())
                        .fechaVencimiento(LocalDate.of(anioEscolar, i, 5)) // Vencen el día 5 de cada mes
                        .estado(EstadoDeuda.PENDIENTE)
                        .build());
            }
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
    public void pagarDeuda(Long id, String metodoPago, String numeroOperacion) {
        Deuda deuda = deudaRepository.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Deuda no encontrada"));

        deuda.setEstado(EstadoDeuda.PAGADA);
        // Si tienes el campo en tu entidad Deuda, ideal. Si no, puedes concatenarlo en numeroOperacion
        deuda.setNumeroOperacion(metodoPago + " - " + numeroOperacion);
        deudaRepository.guardar(deuda);

        String detalle = String.format("Pago vía %s. N° Op: %s", metodoPago, numeroOperacion);
        registrarHistorial(deuda, "COBRO", detalle);
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

        // 👇 Registrar la reversión en el historial
        registrarHistorial(deuda, "REVERSIÓN", motivo);
    }

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

    // 👇 Método auxiliar privado para registrar el movimiento
    private void registrarHistorial(Deuda deuda, String tipoOperacion, String motivo) {
        HistorialPago historial = HistorialPago.builder()
                .deudaId(deuda.getId())
                .estudianteId(deuda.getEstudianteId())
                .colegioId(deuda.getColegioId())
                .tipoOperacion(tipoOperacion)
                .motivo(motivo)
                .build();

        historialPagoPort.guardar(historial);
    }
}