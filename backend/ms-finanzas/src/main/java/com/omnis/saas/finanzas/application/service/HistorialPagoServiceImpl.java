package com.omnis.saas.finanzas.application.service;

import com.omnis.saas.finanzas.domain.model.HistorialPago;
import com.omnis.saas.finanzas.domain.ports.in.ObtenerHistorialUseCase;
import com.omnis.saas.finanzas.domain.ports.out.HistorialPagoRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HistorialPagoServiceImpl implements ObtenerHistorialUseCase {

    private final HistorialPagoRepositoryPort port;

    @Override
    public List<HistorialPago> ejecutar(Long estudianteId) {
        return port.buscarPorEstudiante(estudianteId);
    }
}