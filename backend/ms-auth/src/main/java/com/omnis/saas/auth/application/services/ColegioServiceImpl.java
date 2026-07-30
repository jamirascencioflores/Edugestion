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

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final EmailServicePort emailService; // 👈 1. INYECTAMOS EL PUERTO DE EMAIL

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

        Rol rolResponsable = rolRepository.findByNombre("ADMIN_COLEGIO")
                .orElseThrow(() -> new RuntimeException("El rol ADMIN_COLEGIO no existe"));

        // 👈 2. GENERAMOS UN TOKEN ÚNICO DE ACTIVACIÓN
        String tokenActivacion = UUID.randomUUID().toString();

        Usuario responsable = Usuario.builder()
                .nombreCompleto(dto.nombreResponsable())
                .email(dto.emailResponsable())
                .passwordHash(passwordEncoder.encode(dto.subdominio()))
                .colegio(nuevoColegio)
                .rol(rolResponsable)
                .estado(true)
                .debeCambiarPassword(true)
                .tokenActivacion(tokenActivacion) // 👈 AGREGA ESTA LÍNEA AQUÍ
                .createdAt(LocalDateTime.now())
                .build();

        usuarioRepository.save(responsable);

        // 👈 3. DISPARAR EL ENVÍO DEL CORREO A MAILTRAP
        try {
            emailService.enviarInvitacion(
                    dto.emailResponsable(),
                    dto.nombreResponsable(),
                    tokenActivacion,
                    dto.subdominio()
            );
        } catch (Exception e) {
            // Se captura el log para evitar revertir el registro del colegio si falla la red SMTP
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
        Colegio colegio = colegioRepository.findById(id).orElseThrow(() -> new RuntimeException("Colegio no encontrado"));
        colegio.setNombre(dto.nombre());

        PlanSaas plan = planSaasRepository.findByNombre(dto.plan()).orElseThrow(() -> new RuntimeException("Plan no encontrado"));
        colegio.setPlan(plan);
        colegio = colegioRepository.save(colegio);

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
            // 1. Borrar docentes primero (evita el error de llave foránea)
            docenteRepository.deleteByColegioId(id);

            // 2. Borrar usuarios
            usuarioRepository.deleteByColegioId(id);

            // 3. Borrar el colegio
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