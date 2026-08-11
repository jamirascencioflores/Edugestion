package com.omnis.saas.finanzas.application.service;

import com.omnis.saas.finanzas.domain.model.Deuda;
import com.omnis.saas.finanzas.domain.model.EstadoDeuda;
import com.omnis.saas.finanzas.domain.model.HistorialPago;
import com.omnis.saas.finanzas.domain.model.Tarifario;
import com.omnis.saas.finanzas.domain.ports.in.DeudaUseCase;
import com.omnis.saas.finanzas.domain.ports.out.DeudaRepositoryPort;
import com.omnis.saas.finanzas.domain.ports.out.HistorialPagoRepositoryPort;
import com.omnis.saas.finanzas.domain.ports.out.TarifarioRepositoryPort;
import com.omnis.saas.finanzas.infrastructure.adapters.in.web.dto.ReporteMorosoDTO;
import com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.entity.DeudaEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeudaServiceImpl implements DeudaUseCase {

    private final DeudaRepositoryPort deudaRepository;
    private final TarifarioRepositoryPort tarifarioRepository;
    private final HistorialPagoRepositoryPort historialPagoPort;
    private final RestTemplate restTemplate;

    private static final String[] MESES = {"Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"};

    @Override
    @Transactional
    public void generarCuotasAnuales(Long colegioId, Long estudianteId, Long gradoId, Integer anioEscolar, LocalDate fechaInscripcion) {
        if (fechaInscripcion == null) fechaInscripcion = LocalDate.now();

        int mesInicio = fechaInscripcion.getMonthValue();
        if (mesInicio < 3) mesInicio = 3;

        List<Tarifario> tarifarios = tarifarioRepository.findByColegioIdAndAnioEscolar(colegioId, anioEscolar)
                .stream()
                .filter(t -> t.getGradoId().equals(gradoId) && Boolean.TRUE.equals(t.getEstado()))
                .toList();

        Tarifario tarifaPension = tarifarios.stream()
                .filter(t -> "PENSION".equalsIgnoreCase(t.getTipoTarifa()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Tarifario de PENSIÓN no encontrado para el grado"));

        Tarifario tarifaMatricula = tarifarios.stream()
                .filter(t -> "MATRICULA".equalsIgnoreCase(t.getTipoTarifa()))
                .findFirst()
                .orElse(null);

        List<Deuda> deudas = new ArrayList<>();

        if (tarifaMatricula != null) {
            deudas.add(Deuda.builder()
                    .colegioId(colegioId)
                    .estudianteId(estudianteId)
                    .concepto("Matrícula " + anioEscolar)
                    .monto(tarifaMatricula.getMontoMensual())
                    .fechaVencimiento(fechaInscripcion.plusDays(5))
                    .estado(EstadoDeuda.PENDIENTE)
                    .build());
        }

        if (mesInicio <= 12) {
            for (int i = mesInicio; i <= 12; i++) {
                deudas.add(Deuda.builder()
                        .colegioId(colegioId)
                        .estudianteId(estudianteId)
                        .concepto("Pensión " + MESES[i - 3] + " - " + anioEscolar)
                        .monto(tarifaPension.getMontoMensual())
                        .fechaVencimiento(LocalDate.of(anioEscolar, i, 5))
                        .estado(EstadoDeuda.PENDIENTE)
                        .build());
            }
        }

        deudaRepository.saveAll(deudas);
    }

    @Override
    @Transactional
    public List<Deuda> obtenerPorEstudiante(Long colegioId, Long estudianteId) {
        List<Deuda> deudas = deudaRepository.findByColegioIdAndEstudianteId(colegioId, estudianteId);
        Long gradoId = obtenerGradoIdDeEstudiante(colegioId, estudianteId);

        // 1. Si no tiene ninguna deuda en absoluto (alumno antiguo o nuevo sin registros)
        if (deudas.isEmpty()) {
            if (gradoId != null) {
                generarCuotasAnuales(colegioId, estudianteId, gradoId, LocalDate.now().getYear(), LocalDate.now());
                return deudaRepository.findByColegioIdAndEstudianteId(colegioId, estudianteId);
            }
            return deudas;
        }

        // 2. Si ya tiene deudas, buscamos su Matrícula
        Deuda matriculaExistente = deudas.stream()
                .filter(d -> d.getConcepto() != null && d.getConcepto().toLowerCase().contains("matrícula"))
                .findFirst()
                .orElse(null);

        Integer anioEscolar = deudas.get(0).getFechaVencimiento() != null
                ? deudas.get(0).getFechaVencimiento().getYear()
                : LocalDate.now().getYear();

        if (gradoId != null) {
            // Buscar el tarifario de MATRÍCULA para el colegio y grado actual del alumno
            Tarifario tarifaMatricula = tarifarioRepository.findByColegioIdAndAnioEscolar(colegioId, anioEscolar)
                    .stream()
                    .filter(t -> t.getGradoId().equals(gradoId)
                            && "MATRICULA".equalsIgnoreCase(t.getTipoTarifa())
                            && Boolean.TRUE.equals(t.getEstado()))
                    .findFirst()
                    .orElse(null);

            if (tarifaMatricula != null) {
                // CASO A: Si NO tiene matrícula, se la creamos con la tarifa de su grado
                if (matriculaExistente == null) {
                    Deuda nuevaMatricula = Deuda.builder()
                            .colegioId(colegioId)
                            .estudianteId(estudianteId)
                            .concepto("Matrícula " + anioEscolar)
                            .monto(tarifaMatricula.getMontoMensual())
                            .fechaVencimiento(LocalDate.of(anioEscolar, 3, 1))
                            .estado(EstadoDeuda.PENDIENTE)
                            .build();

                    deudaRepository.saveAll(List.of(nuevaMatricula));
                    return deudaRepository.findByColegioIdAndEstudianteId(colegioId, estudianteId);
                }
                // CASO B: Si la matrícula existe, está PENDIENTE y el alumno cambió de grado
                else if (matriculaExistente.getEstado() == EstadoDeuda.PENDIENTE
                        && matriculaExistente.getMonto().compareTo(tarifaMatricula.getMontoMensual()) != 0) {
                    matriculaExistente.setMonto(tarifaMatricula.getMontoMensual());
                    deudaRepository.guardar(matriculaExistente);
                    return deudaRepository.findByColegioIdAndEstudianteId(colegioId, estudianteId);
                }
            }
        }

        return deudas;
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
            deuda.setMotivoReversion(null);
        });

        deudaRepository.saveAll(anuladas);
    }

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

    // Helper privado para resolver la jerarquía seccion -> grado desde ms-academico
    // Resolver gradoId mediante seccionId
    private Long obtenerGradoIdDeEstudiante(Long colegioId, Long estudianteId) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Colegio-Id", String.valueOf(colegioId));
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            // A. Obtener datos del estudiante
            ResponseEntity<Map> respEstudiante = restTemplate.exchange(
                    "http://ms-academico/api/academicos/estudiantes/" + estudianteId,
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            if (respEstudiante.getBody() != null && respEstudiante.getBody().containsKey("seccionId")) {
                Object seccionIdObj = respEstudiante.getBody().get("seccionId");
                if (seccionIdObj != null) {
                    Long seccionId = Long.valueOf(seccionIdObj.toString());

                    // B. Consultar la Sección a ms-academico para obtener su gradoId
                    ResponseEntity<Map> respSeccion = restTemplate.exchange(
                            "http://ms-academico/api/academicos/secciones/" + seccionId,
                            HttpMethod.GET,
                            entity,
                            Map.class
                    );

                    if (respSeccion.getBody() != null && respSeccion.getBody().containsKey("gradoId")) {
                        return Long.valueOf(respSeccion.getBody().get("gradoId").toString());
                    }
                }
            }
        } catch (Exception e) {
            System.err.println(">>> ERROR RESOLVIENDO GRADO VÍA SECCIÓN: " + e.getMessage());
        }
        return null;
    }

    @Transactional(readOnly = true)
    public List<ReporteMorosoDTO> obtenerDetalleMorosos(Long colegioId) {
        // Llama directamente al método del repositorio
        List<DeudaEntity> deudasPendientes = deudaRepository.findByColegioIdAndEstado(colegioId, EstadoDeuda.PENDIENTE);

        Map<Long, List<DeudaEntity>> deudasPorEstudiante = deudasPendientes.stream()
                .collect(Collectors.groupingBy(DeudaEntity::getEstudianteId));

        List<ReporteMorosoDTO> reporte = new ArrayList<>();

        for (Map.Entry<Long, List<DeudaEntity>> entry : deudasPorEstudiante.entrySet()) {
            Long estudianteId = entry.getKey();
            List<DeudaEntity> deudas = entry.getValue();

            BigDecimal montoTotal = deudas.stream()
                    .map(DeudaEntity::getMonto)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            List<String> conceptosPendientes = deudas.stream()
                    .map(DeudaEntity::getConcepto)
                    .collect(Collectors.toList());

            reporte.add(ReporteMorosoDTO.builder()
                    .estudianteId(estudianteId)
                    .nombreEstudiante("Estudiante ID: " + estudianteId)
                    .dni("DNI-" + estudianteId)
                    .gradoSeccion("1er Año A")
                    .mesesAtrasados((long) deudas.size())
                    .montoTotalDeuda(montoTotal)
                    .mesesPendientes(conceptosPendientes)
                    .build());
        }

        return reporte;
    }
}