package com.omnis.saas.finanzas.domain.ports.in;

import com.omnis.saas.finanzas.domain.model.Deuda;

import java.time.LocalDate;
import java.util.List;

public interface DeudaUseCase {
    void generarCuotasAnuales(Long colegioId, Long estudianteId, Long gradoId, Integer anioEscolar, LocalDate fechaInscripcion);
    List<Deuda> obtenerPorEstudiante(Long colegioId, Long estudianteId);
    void anularDeuda(Long colegioId, Long deudaId);

    // Método de cobro actualizado (acepta numeroOperacion nulo)
    void pagarDeuda(Long id, String metodoPago, String numeroOperacion);
    // Método de reversión
    void revertirPago(Long deudaId, String motivo);

    // 👇 El nuevo método para el retiro de alumnos
    void anularCuotasPendientes(Long colegioId, Long estudianteId);

    void reactivarCuotasAnuladas(Long colegioId, Long estudianteId);

}