package com.omnis.saas.finanzas.domain.ports.out;

import com.omnis.saas.finanzas.domain.model.HistorialPago;

import java.util.List;

public interface HistorialPagoRepositoryPort {
    HistorialPago guardar(HistorialPago historial);
    List<HistorialPago> buscarPorEstudiante(Long estudianteId);
}