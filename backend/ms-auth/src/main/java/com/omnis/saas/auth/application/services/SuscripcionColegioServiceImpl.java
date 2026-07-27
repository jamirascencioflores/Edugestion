package com.omnis.saas.auth.application.services;

import com.omnis.saas.auth.domain.model.CargoAdicional;
import com.omnis.saas.auth.domain.model.Colegio;
import com.omnis.saas.auth.domain.model.PlanSaas;
import com.omnis.saas.auth.domain.model.SuscripcionColegio;
import com.omnis.saas.auth.domain.ports.in.SuscripcionColegioUseCase;
import com.omnis.saas.auth.domain.ports.out.ColegioRepositoryPort;
import com.omnis.saas.auth.domain.ports.out.SuscripcionColegioRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SuscripcionColegioServiceImpl implements SuscripcionColegioUseCase {

    private final SuscripcionColegioRepositoryPort suscripcionRepository;
    private final ColegioRepositoryPort colegioRepository;

    @Override
    public List<SuscripcionColegio> obtenerTodasLasSuscripciones() {
        List<Colegio> colegios = colegioRepository.findAll();

        for (Colegio colegio : colegios) {
            suscripcionRepository.findByColegioId(colegio.getId()).orElseGet(() -> {
                PlanSaas planBase = colegio.getPlan();

                boolean portal = planBase != null && Boolean.TRUE.equals(planBase.getPermitePortalPadres());
                boolean notif = planBase != null && Boolean.TRUE.equals(planBase.getPermiteNotificaciones());
                boolean pdfs = planBase != null && Boolean.TRUE.equals(planBase.getPermiteReportesPdf());
                boolean marca = planBase != null && Boolean.TRUE.equals(planBase.getPermiteMarcaBlanca());
                boolean finanzas = planBase != null && Boolean.TRUE.equals(planBase.getPermiteFinanzasPro());
                BigDecimal precio = planBase != null ? planBase.getPrecioMensual() : BigDecimal.ZERO;

                SuscripcionColegio nuevaSuscripcion = SuscripcionColegio.builder()
                        .colegioId(colegio.getId())
                        .nombreColegio(colegio.getNombre()) // <-- Seteamos el nombre aquí
                        .planBase(planBase)
                        .permitePortalPadres(portal)
                        .permiteNotificaciones(notif)
                        .permiteReportesPdf(pdfs)
                        .permiteMarcaBlanca(marca)
                        .permiteFinanzasPro(finanzas)
                        .montoAdicional(BigDecimal.ZERO)
                        .montoTotalMensual(precio)
                        .build();

                return suscripcionRepository.save(nuevaSuscripcion);
            });
        }

        // Al recuperar de la BD, adjuntamos dinámicamente el nombre del colegio
        List<SuscripcionColegio> suscripciones = suscripcionRepository.findAll();
        suscripciones.forEach(sub -> {
            if (sub.getNombreColegio() == null || sub.getNombreColegio().isBlank()) {
                colegioRepository.findById(sub.getColegioId())
                        .ifPresent(col -> sub.setNombreColegio(col.getNombre()));
            }
        });

        return suscripciones;
    }

    @Override
    public SuscripcionColegio obtenerPorColegioId(Long colegioId) {
        return suscripcionRepository.findByColegioId(colegioId)
                .orElseThrow(() -> new RuntimeException("Suscripción no encontrada para el colegio con ID: " + colegioId));
    }

    @Override
    public SuscripcionColegio actualizarSuscripcion(Long colegioId, SuscripcionColegio actualizada) {
        SuscripcionColegio existente = obtenerPorColegioId(colegioId);

        existente.setPermitePortalPadres(actualizada.getPermitePortalPadres());
        existente.setPermiteNotificaciones(actualizada.getPermiteNotificaciones());
        existente.setPermiteReportesPdf(actualizada.getPermiteReportesPdf());
        existente.setPermiteMarcaBlanca(actualizada.getPermiteMarcaBlanca());
        existente.setPermiteFinanzasPro(actualizada.getPermiteFinanzasPro());

        List<CargoAdicional> listaCargos = actualizada.getCargosAdicionales() != null
                ? new ArrayList<>(actualizada.getCargosAdicionales())
                : new ArrayList<>();

        existente.setCargosAdicionales(listaCargos);

        BigDecimal sumaCargos = listaCargos.stream()
                .map(cargo -> cargo.getMonto() != null ? cargo.getMonto() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        existente.setMontoAdicional(sumaCargos);

        BigDecimal precioBase = existente.getPlanBase() != null ? existente.getPlanBase().getPrecioMensual() : BigDecimal.ZERO;
        existente.setMontoTotalMensual(precioBase.add(sumaCargos));

        return suscripcionRepository.save(existente);
    }
}