package com.omnis.saas.auth.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.auth.domain.model.Docente;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.DocenteEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DocenteMapper {

    private final ColegioMapper colegioMapper;
    private final UsuarioMapper usuarioMapper;

    public Docente toDomain(DocenteEntity entity) {
        if (entity == null) return null;
        return Docente.builder()
                .id(entity.getId())
                .nombres(entity.getNombres())
                .apellidos(entity.getApellidos())
                .documentoIdentidad(entity.getDocumentoIdentidad())
                .email(entity.getEmail())
                .especialidad(entity.getEspecialidad())
                .colegio(colegioMapper.toDomain(entity.getColegio()))
                // Asegúrate de que en tu DocenteEntity el usuario se llame "usuarioEntity" (o cámbialo si se llama "usuario")
                .usuario(usuarioMapper.toDomain(entity.getUsuarioEntity()))
                .estado(entity.getEstado())
                .build();
    }

    public DocenteEntity toEntity(Docente domain) {
        if (domain == null) return null;
        DocenteEntity entity = new DocenteEntity();
        entity.setId(domain.getId());
        entity.setNombres(domain.getNombres());
        entity.setApellidos(domain.getApellidos());
        entity.setDocumentoIdentidad(domain.getDocumentoIdentidad());
        entity.setEmail(domain.getEmail());
        entity.setEspecialidad(domain.getEspecialidad());
        entity.setColegio(colegioMapper.toEntity(domain.getColegio()));
        entity.setUsuarioEntity(usuarioMapper.toEntity(domain.getUsuario()));
        entity.setEstado(domain.getEstado());
        return entity;
    }
}