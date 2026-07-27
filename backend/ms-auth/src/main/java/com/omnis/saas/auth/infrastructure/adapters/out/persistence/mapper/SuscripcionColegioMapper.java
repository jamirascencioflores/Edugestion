package com.omnis.saas.auth.infrastructure.adapters.out.persistence.mapper;

import com.omnis.saas.auth.domain.model.CargoAdicional;
import com.omnis.saas.auth.domain.model.SuscripcionColegio;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.CargoAdicionalEmbeddable;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.SuscripcionColegioEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SuscripcionColegioMapper {

    private final PlanSaasMapper planSaasMapper;

    public SuscripcionColegio toDomain(SuscripcionColegioEntity entity) {
        if (entity == null) return null;

        var cargosDomain = entity.getCargosAdicionales() == null ? Collections.<CargoAdicional>emptyList() :
                entity.getCargosAdicionales().stream()
                        .map(c -> new CargoAdicional(c.getConcepto(), c.getMonto()))
                        .collect(Collectors.toList());

        return SuscripcionColegio.builder()
                .id(entity.getId())
                .colegioId(entity.getColegioId())
                .planBase(planSaasMapper.toDomain(entity.getPlanBase()))
                .permitePortalPadres(entity.getPermitePortalPadres())
                .permiteNotificaciones(entity.getPermiteNotificaciones())
                .permiteReportesPdf(entity.getPermiteReportesPdf())
                .permiteMarcaBlanca(entity.getPermiteMarcaBlanca())
                .permiteFinanzasPro(entity.getPermiteFinanzasPro())
                .cargosAdicionales(cargosDomain)
                .montoAdicional(entity.getMontoAdicional())
                .montoTotalMensual(entity.getMontoTotalMensual())
                .build();
    }

    public SuscripcionColegioEntity toEntity(SuscripcionColegio domain) {
        if (domain == null) return null;

        SuscripcionColegioEntity entity = new SuscripcionColegioEntity();
        entity.setId(domain.getId());
        entity.setColegioId(domain.getColegioId());
        entity.setPlanBase(planSaasMapper.toEntity(domain.getPlanBase()));
        entity.setPermitePortalPadres(domain.getPermitePortalPadres());
        entity.setPermiteNotificaciones(domain.getPermiteNotificaciones());
        entity.setPermiteReportesPdf(domain.getPermiteReportesPdf());
        entity.setPermiteMarcaBlanca(domain.getPermiteMarcaBlanca());
        entity.setPermiteFinanzasPro(domain.getPermiteFinanzasPro());

        var cargosEmbeddable = domain.getCargosAdicionales() == null ? Collections.<CargoAdicionalEmbeddable>emptyList() :
                domain.getCargosAdicionales().stream()
                        .map(c -> new CargoAdicionalEmbeddable(c.getConcepto(), c.getMonto()))
                        .collect(Collectors.toList());

        entity.setCargosAdicionales(cargosEmbeddable);
        entity.setMontoAdicional(domain.getMontoAdicional());
        entity.setMontoTotalMensual(domain.getMontoTotalMensual());
        return entity;
    }
}