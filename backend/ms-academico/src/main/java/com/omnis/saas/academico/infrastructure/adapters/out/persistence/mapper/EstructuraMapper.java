package com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.academico.domain.model.Curso;
import com.omnis.saas.academico.domain.model.Grado;
import com.omnis.saas.academico.domain.model.Seccion;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.CursoEntity;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.GradoEntity;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.SeccionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EstructuraMapper {

    Grado toGradoDomain(GradoEntity entity);
    GradoEntity toGradoEntity(Grado domain);

    @Mapping(target = "gradoId", source = "grado.id")
    Seccion toSeccionDomain(SeccionEntity entity);

    @Mapping(target = "grado.id", source = "gradoId")
    SeccionEntity toSeccionEntity(Seccion domain);

    @Mapping(target = "areaAcademica.id", source = "areaAcademicaId")
    CursoEntity toCursoEntity(Curso domain);

    @Mapping(target = "areaAcademicaId", source = "areaAcademica.id")
    Curso toCursoDomain(CursoEntity entity);
}