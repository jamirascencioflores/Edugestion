package com.omnis.saas.auth.application.services;

import com.omnis.saas.auth.domain.model.Colegio;
import com.omnis.saas.auth.domain.model.PlanSaas;
import com.omnis.saas.auth.domain.model.Rol;
import com.omnis.saas.auth.domain.model.Usuario;
import com.omnis.saas.auth.domain.ports.in.ColegioUseCase;
import com.omnis.saas.auth.domain.ports.out.*;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.ColegioActualizarDTO;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.ColegioRegistroDTO;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.ColegioResumenDTO;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.SuscripcionColegioEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.PlanSaasEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.SuscripcionColegioJpaRepository;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.PlanSaasJpaRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ColegioServiceImpl implements ColegioUseCase {

    private final ColegioRepositoryPort colegioRepository;
    private final PlanSaasRepositoryPort planSaasRepository;
    private final RolRepositoryPort rolRepository;
    private final UsuarioRepositoryPort usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final DocenteRepositoryPort docenteRepository;
    private final EmailServicePort emailService;

    // Repositorios JPA para gestionar la sincronización de Suscripciones
    private final SuscripcionColegioJpaRepository suscripcionRepository;
    private final PlanSaasJpaRepository planSaasJpaRepository;

    @Override
    @Transactional
    public Colegio registrarNuevoColegio(ColegioRegistroDTO dto) {
        if (colegioRepository.findBySubdominio(dto.subdominio()).isPresent()) {
            throw new RuntimeException("El subdominio ya está en uso");
        }

        PlanSaas plan = planSaasRepository.findByNombre(dto.plan())
                .orElseThrow(() -> new RuntimeException("El plan seleccionado no existe"));

        Colegio nuevoColegio = Colegio.builder()
                .nombre(dto.nombre())
                .subdominio(dto.subdominio())
                .plan(plan)
                .estado(true)
                .createdAt(LocalDateTime.now())
                .estadoSuscripcion("ACTIVO")
                .build();

        nuevoColegio = colegioRepository.save(nuevoColegio);

        // Crear registro inicial de suscripción
        PlanSaasEntity planEntity = planSaasJpaRepository.findById(plan.getId()).orElse(null);
        if (planEntity != null) {
            SuscripcionColegioEntity nuevaSub = new SuscripcionColegioEntity();
            nuevaSub.setColegioId(nuevoColegio.getId());
            nuevaSub.setPlanBase(planEntity);
            nuevaSub.setPermitePortalPadres(planEntity.getPermitePortalPadres());
            nuevaSub.setPermiteNotificaciones(planEntity.getPermiteNotificaciones());
            nuevaSub.setPermiteReportesPdf(planEntity.getPermiteReportesPdf());
            nuevaSub.setPermiteMarcaBlanca(planEntity.getPermiteMarcaBlanca());
            nuevaSub.setPermiteFinanzasPro(planEntity.getPermiteFinanzasPro());
            nuevaSub.setMontoAdicional(BigDecimal.ZERO);
            nuevaSub.setMontoTotalMensual(planEntity.getPrecioMensual());
            suscripcionRepository.save(nuevaSub);
        }

        Rol rolResponsable = rolRepository.findByNombre("ADMIN_COLEGIO")
                .orElseThrow(() -> new RuntimeException("El rol ADMIN_COLEGIO no existe"));

        String tokenActivacion = UUID.randomUUID().toString();

        Usuario responsable = Usuario.builder()
                .nombreCompleto(dto.nombreResponsable())
                .email(dto.emailResponsable())
                .passwordHash(passwordEncoder.encode(dto.subdominio()))
                .colegio(nuevoColegio)
                .rol(rolResponsable)
                .estado(true)
                .debeCambiarPassword(true)
                .tokenActivacion(tokenActivacion)
                .createdAt(LocalDateTime.now())
                .build();

        usuarioRepository.save(responsable);

        try {
            emailService.enviarInvitacion(
                    dto.emailResponsable(),
                    dto.nombreResponsable(),
                    tokenActivacion,
                    dto.subdominio()
            );
        } catch (Exception e) {
            System.err.println("⚠ No se pudo enviar el correo de activación: " + e.getMessage());
        }

        return nuevoColegio;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ColegioResumenDTO> listarTodos() {
        return colegioRepository.findAll().stream().map(colegio -> {
            var responsableOpt = usuarioRepository.findFirstByColegioIdAndRolNombre(colegio.getId(), "ADMIN_COLEGIO");

            String nombreResp = responsableOpt.map(Usuario::getNombreCompleto).orElse("Sin asignar");
            String emailResp = responsableOpt.map(Usuario::getEmail).orElse("Sin correo");
            String planNombre = (colegio.getPlan() != null) ? colegio.getPlan().getNombre() : "SIN PLAN";

            return new ColegioResumenDTO(
                    colegio.getId(),
                    colegio.getNombre(),
                    colegio.getSubdominio(),
                    planNombre,
                    nombreResp,
                    emailResp,
                    colegio.getEstado() != null ? colegio.getEstado() : true
            );
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Colegio actualizarColegio(Long id, ColegioActualizarDTO dto) {
        Colegio colegio = colegioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Colegio no encontrado"));
        colegio.setNombre(dto.nombre());

        PlanSaas plan = planSaasRepository.findByNombre(dto.plan())
                .orElseThrow(() -> new RuntimeException("Plan no encontrado"));
        colegio.setPlan(plan);
        colegio = colegioRepository.save(colegio);

        // 1. Sincronizar tabla suscripciones_colegio
        PlanSaasEntity planEntity = planSaasJpaRepository.findById(plan.getId()).orElse(null);
        if (planEntity != null) {
            suscripcionRepository.findByColegioId(id).ifPresentOrElse(sub -> {
                sub.setPlanBase(planEntity);
                sub.setPermitePortalPadres(planEntity.getPermitePortalPadres());
                sub.setPermiteNotificaciones(planEntity.getPermiteNotificaciones());
                sub.setPermiteReportesPdf(planEntity.getPermiteReportesPdf());
                sub.setPermiteMarcaBlanca(planEntity.getPermiteMarcaBlanca());
                sub.setPermiteFinanzasPro(planEntity.getPermiteFinanzasPro());

                BigDecimal adicional = sub.getMontoAdicional() != null ? sub.getMontoAdicional() : BigDecimal.ZERO;
                sub.setMontoTotalMensual(planEntity.getPrecioMensual().add(adicional));

                suscripcionRepository.save(sub);
            }, () -> {
                // Si el colegio existía pero aún no tenía fila de suscripción
                SuscripcionColegioEntity nuevaSub = new SuscripcionColegioEntity();
                nuevaSub.setColegioId(id);
                                nuevaSub.setPlanBase(planEntity);
                nuevaSub.setPermitePortalPadres(planEntity.getPermitePortalPadres());
                nuevaSub.setPermiteNotificaciones(planEntity.getPermiteNotificaciones());
                nuevaSub.setPermiteReportesPdf(planEntity.getPermiteReportesPdf());
                nuevaSub.setPermiteMarcaBlanca(planEntity.getPermiteMarcaBlanca());
                nuevaSub.setPermiteFinanzasPro(planEntity.getPermiteFinanzasPro());
                nuevaSub.setMontoAdicional(BigDecimal.ZERO);
                nuevaSub.setMontoTotalMensual(planEntity.getPrecioMensual());
                suscripcionRepository.save(nuevaSub);
            });
        }

        // 2. Actualizar nombre del responsable
        usuarioRepository.findFirstByColegioIdAndRolNombre(id, "ADMIN_COLEGIO")
                .ifPresent(admin -> {
                    admin.setNombreCompleto(dto.nombreResponsable());
                    usuarioRepository.save(admin);
                });

        return colegio;
    }

    @Override
    @Transactional
    public void cambiarEstado(Long id) {
        Colegio colegio = colegioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Colegio no encontrado"));

        colegio.setEstado(!colegio.getEstado());
        colegioRepository.save(colegio);
    }

    @Transactional
    @Override
    public void eliminarColegio(Long id) {
        Colegio colegio = colegioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Colegio no encontrado"));

        if (colegio.getEstado() != null && colegio.getEstado()) {
            throw new RuntimeException("No puedes eliminar un colegio activo. Desactívalo primero.");
        }

        try {
            // 1. Borrar docentes
            docenteRepository.deleteByColegioId(id);

            // 2. Borrar usuarios
            usuarioRepository.deleteByColegioId(id);

            // 4. Borrar el colegio
            colegioRepository.delete(colegio);
        } catch (Exception e) {
            throw new RuntimeException("Error al eliminar los datos vinculados: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validarSubdominio(String subdominio) {
        return colegioRepository.findBySubdominio(subdominio).isEmpty();
    }
}