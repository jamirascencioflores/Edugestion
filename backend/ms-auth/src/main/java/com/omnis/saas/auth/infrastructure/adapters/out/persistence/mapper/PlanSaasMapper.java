package com.omnis.saas.auth.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.auth.domain.model.PlanSaas;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.PlanSaasEntity;
import org.springframework.stereotype.Component;

@Component
public class PlanSaasMapper {

    public PlanSaas toDomain(PlanSaasEntity entity) {
        if (entity == null) return null;
        return PlanSaas.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .limiteAlumnos(entity.getLimiteAlumnos())
                .precioMensual(entity.getPrecioMensual())
                .permitePortalPadres(entity.getPermitePortalPadres())
                .permiteNotificaciones(entity.getPermiteNotificaciones())
                .permiteReportesPdf(entity.getPermiteReportesPdf())
                .permiteMarcaBlanca(entity.getPermiteMarcaBlanca())
                .permiteFinanzasPro(entity.getPermiteFinanzasPro())
                .build();
    }

    public PlanSaasEntity toEntity(PlanSaas domain) {
        if (domain == null) return null;
        PlanSaasEntity entity = new PlanSaasEntity();
        entity.setId(domain.getId());
        entity.setNombre(domain.getNombre());
        entity.setLimiteAlumnos(domain.getLimiteAlumnos());
        entity.setPrecioMensual(domain.getPrecioMensual());
        entity.setPermitePortalPadres(domain.getPermitePortalPadres());
        entity.setPermiteNotificaciones(domain.getPermiteNotificaciones());
        entity.setPermiteReportesPdf(domain.getPermiteReportesPdf());
        entity.setPermiteMarcaBlanca(domain.getPermiteMarcaBlanca());
        entity.setPermiteFinanzasPro(domain.getPermiteFinanzasPro());
        return entity;
    }
}