package com.omnis.saas.academico.domain.ports.in;

import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.ImportacionResultadoDTO;
import org.springframework.web.multipart.MultipartFile;

public interface ImportacionEstructuraUseCase {
    ImportacionResultadoDTO procesarExcelEstructura(MultipartFile file, Long colegioId);
}