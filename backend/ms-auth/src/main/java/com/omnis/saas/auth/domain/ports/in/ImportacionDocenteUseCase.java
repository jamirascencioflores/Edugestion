package com.omnis.saas.auth.domain.ports.in;

import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.ImportacionResultadoDTO;
import org.springframework.web.multipart.MultipartFile;

public interface ImportacionDocenteUseCase {
    ImportacionResultadoDTO procesarExcelDocentes(MultipartFile file, Long colegioId);
}