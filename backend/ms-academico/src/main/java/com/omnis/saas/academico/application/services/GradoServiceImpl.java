package com.omnis.saas.academico.application.services;

import com.omnis.saas.academico.domain.model.Grado;
import com.omnis.saas.academico.domain.ports.in.GradoUseCase;
import com.omnis.saas.academico.domain.ports.out.GradoRepositoryPort;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.GradoActualizarDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GradoServiceImpl implements GradoUseCase {

    private final GradoRepositoryPort repositoryPort;

    @Override
    @Transactional
    public Grado registrar(Grado grado) {
        return repositoryPort.save(grado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Grado> listar() {
        return repositoryPort.findAll();
    }

    @Override
    @Transactional
    public Grado actualizar(Long id, GradoActualizarDTO dto, Long colegioId) {
        Grado existente = repositoryPort.findById(id)
                .orElseThrow(() -> new RuntimeException("Grado no encontrado"));

        if (!existente.getColegioId().equals(colegioId)) {
            throw new RuntimeException("Sin permisos para modificar este grado");
        }

        // 👇 LA MAGIA OCURRE AQUÍ 👇
        existente.setNombre(dto.nombre());
        existente.setOrden(dto.orden()); // 👈 ¡Esta es la línea que faltaba!
        existente.setEstado(dto.estado());

        return repositoryPort.save(existente);
    }

    @Override
    @Transactional
    public void eliminar(Long id, Long colegioId) {
        Grado existente = repositoryPort.findById(id)
                .orElseThrow(() -> new RuntimeException("Grado no encontrado"));

        if (!existente.getColegioId().equals(colegioId)) {
            throw new RuntimeException("Sin permisos para eliminar este grado");
        }

        repositoryPort.deleteById(id);
    }
}