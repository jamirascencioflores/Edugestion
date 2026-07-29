package com.omnis.saas.academico.infrastructure.adapters.out.persistence;

import com.omnis.saas.academico.domain.model.Curso;
import com.omnis.saas.academico.domain.model.Grado;
import com.omnis.saas.academico.domain.model.Seccion;
import com.omnis.saas.academico.domain.ports.out.CursoOutputPort;
import com.omnis.saas.academico.domain.ports.out.GradoOutputPort;
import com.omnis.saas.academico.domain.ports.out.SeccionOutputPort;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper.EstructuraMapper;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.SpringDataCursoRepository;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.SpringDataGradoRepository;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.SpringDataSeccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class EstructuraPersistenceAdapter implements GradoOutputPort, SeccionOutputPort, CursoOutputPort {

    private final SpringDataGradoRepository gradoRepository;
    private final SpringDataSeccionRepository seccionRepository;
    private final SpringDataCursoRepository cursoRepository;
    private final EstructuraMapper mapper;

    @Override
    public Grado guardar(Grado grado) {
        var entity = mapper.toGradoEntity(grado);
        return mapper.toGradoDomain(gradoRepository.save(entity));
    }

    @Override
    public Optional<Grado> buscarGradoPorNombreYColegio(String nombre, Long colegioId) {
        return gradoRepository.findByNombreAndColegioId(nombre, colegioId)
                .map(mapper::toGradoDomain);
    }

    @Override
    public Seccion guardar(Seccion seccion) {
        var entity = mapper.toSeccionEntity(seccion);
        return mapper.toSeccionDomain(seccionRepository.save(entity));
    }

    @Override
    public Optional<Seccion> buscarSeccionPorNombreYGrado(String nombre, Long gradoId) {
        return seccionRepository.findByNombreAndGradoId(nombre, gradoId)
                .map(mapper::toSeccionDomain);
    }

    @Override
    public Curso guardar(Curso curso) {
        var entity = mapper.toCursoEntity(curso);
        return mapper.toCursoDomain(cursoRepository.save(entity));
    }

    @Override
    public Optional<Curso> buscarCursoPorNombreYColegio(String nombre, Long colegioId) {
        return cursoRepository.findByNombreAndColegioId(nombre, colegioId)
                .map(mapper::toCursoDomain);
    }
}