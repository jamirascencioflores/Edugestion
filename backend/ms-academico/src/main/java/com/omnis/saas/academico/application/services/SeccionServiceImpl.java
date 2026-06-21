package com.omnis.saas.academico.application.services;

import com.omnis.saas.academico.domain.model.Grado;
import com.omnis.saas.academico.domain.model.Seccion;
import com.omnis.saas.academico.domain.ports.in.SeccionUseCase;
import com.omnis.saas.academico.domain.ports.out.GradoRepositoryPort;
import com.omnis.saas.academico.domain.ports.out.SeccionRepositoryPort;
import com.omnis.saas.academico.infrastructure.adapters.in.web.dto.SeccionActualizarDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeccionServiceImpl implements SeccionUseCase {

    private final SeccionRepositoryPort seccionRepositoryPort;
    private final GradoRepositoryPort gradoRepositoryPort;

    @Override
    @Transactional
    public Seccion registrar(Seccion seccion) {
        return seccionRepositoryPort.save(seccion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Seccion> listar() {
        return seccionRepositoryPort.findAll();
    }

    @Override
    @Transactional
    public Seccion actualizar(Long id, SeccionActualizarDTO dto, Long colegioId) {
        Seccion existente = seccionRepositoryPort.findById(id)
                .orElseThrow(() -> new RuntimeException("Sección no encontrada"));

        if (!existente.getColegioId().equals(colegioId)) {
            throw new RuntimeException("Sin permisos para modificar esta sección");
        }

        // Validamos que el nuevo grado exista y pertenezca al colegio
        Grado grado = gradoRepositoryPort.findById(dto.gradoId())
                .orElseThrow(() -> new RuntimeException("Grado no encontrado"));

        if (!grado.getColegioId().equals(colegioId)) {
            throw new RuntimeException("El grado especificado no pertenece a su colegio");
        }

        existente.setNombre(dto.nombre());
        existente.setCapacidadMaxima(dto.capacidadMaxima());
        existente.setGradoId(grado.getId()); // <-- Aquí estaba la diferencia
        existente.setEstado(dto.estado());

        return seccionRepositoryPort.save(existente);
    }

    @Override
    @Transactional
    public void eliminar(Long id, Long colegioId) {
        Seccion existente = seccionRepositoryPort.findById(id)
                .orElseThrow(() -> new RuntimeException("Sección no encontrada"));

        if (!existente.getColegioId().equals(colegioId)) {
            throw new RuntimeException("Sin permisos para eliminar esta sección");
        }

        seccionRepositoryPort.deleteById(id);
    }
}