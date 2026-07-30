package com.omnis.saas.finanzas.domain.ports.in;

import java.time.LocalDate;

public interface GenerarDeudasEstudianteUseCase {
    void generarPensionesAnuales(Long colegioId, Long estudianteId, Long gradoId, Integer anioEscolar, LocalDate fechaInscripcion);
}