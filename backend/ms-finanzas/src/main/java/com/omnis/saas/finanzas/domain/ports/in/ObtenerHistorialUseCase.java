package com.omnis.saas.finanzas.domain.ports.in;
import com.omnis.saas.finanzas.domain.model.HistorialPago;
import java.util.List;

public interface ObtenerHistorialUseCase {
    List<HistorialPago> ejecutar(Long estudianteId);
}