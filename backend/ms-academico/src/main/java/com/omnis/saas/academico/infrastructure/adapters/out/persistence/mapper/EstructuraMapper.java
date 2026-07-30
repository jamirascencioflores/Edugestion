package com.omnis.saas.academico.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.academico.domain.model.Curso;
import com.omnis.saas.academico.domain.model.Grado;
import com.omnis.saas.academico.domain.model.Seccion;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.AreaAcademicaEntity;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.CursoEntity;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.GradoEntity;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.SeccionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EstructuraMapper {

    // --- GRADO ---
    Grado toGradoDomain(GradoEntity entity);
    GradoEntity toGradoEntity(Grado domain);

    // --- SECCIÓN ---
    @Mapping(source = "grado.id", target = "gradoId")
    Seccion toSeccionDomain(SeccionEntity entity);

    @Mapping(source = "gradoId", target = "grado.id")
    SeccionEntity toSeccionEntity(Seccion domain);

    // --- CURSO ---
    @Mapping(source = "areaAcademica.id", target = "areaAcademicaId")
    Curso toCursoDomain(CursoEntity entity);

    // 👈 AQUÍ ESTABA LA FALLA: Expresión explícita para evitar instanciar 'new AreaAcademicaEntity()'
    @Mapping(target = "areaAcademica", expression = "java(domain.getAreaAcademicaId() != null && domain.getAreaAcademicaId() > 0 ? com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.AreaAcademicaEntity.builder().id(domain.getAreaAcademicaId()).build() : null)")
    CursoEntity toCursoEntity(Curso domain);
}