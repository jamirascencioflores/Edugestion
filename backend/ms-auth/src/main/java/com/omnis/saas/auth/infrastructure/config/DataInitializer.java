package com.omnis.saas.auth.infrastructure.config;

import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.PlanSaasEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.RolEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.UsuarioEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.ColegioJpaRepository;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.PlanSaasJpaRepository;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.RolJpaRepository;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.UsuarioJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RolJpaRepository rolRepository;
    private final PlanSaasJpaRepository planRepository;
    private final ColegioJpaRepository colegioRepository;
    private final UsuarioJpaRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Iniciando la validación y carga de datos semilla...");

        // 1. Crear Roles si no existen
        if (rolRepository.count() == 0) {
            rolRepository.saveAll(List.of(
                    new RolEntity(null, "SUPERADMIN"),
                    new RolEntity(null, "ADMIN_COLEGIO"),
                    new RolEntity(null, "DOCENTE"),
                    new RolEntity(null, "ESTUDIANTE"),
                    new RolEntity(null, "PADRE")
            ));
            log.info("Roles iniciales creados.");
        }

        // 2. Crear Planes SaaS si no existen
        if (planRepository.count() == 0) {
            PlanSaasEntity basico = new PlanSaasEntity();
            basico.setNombre("BÁSICO");
            basico.setLimiteAlumnos(300);
            basico.setPrecioMensual(new BigDecimal("150.00"));
            basico.setPermitePortalPadres(false);
            basico.setPermiteNotificaciones(false);
            basico.setPermiteReportesPdf(false);
            basico.setPermiteMarcaBlanca(false);
            basico.setPermiteFinanzasPro(false);

            PlanSaasEntity premium = new PlanSaasEntity();
            premium.setNombre("PREMIUM");
            premium.setLimiteAlumnos(999999);
            premium.setPrecioMensual(new BigDecimal("350.00"));
            premium.setPermitePortalPadres(true);
            premium.setPermiteNotificaciones(true);
            premium.setPermiteReportesPdf(true);
            premium.setPermiteMarcaBlanca(true);
            premium.setPermiteFinanzasPro(true);

            planRepository.saveAll(List.of(basico, premium));
            log.info("Planes SaaS iniciales creados.");
        }

        // 3. Crear el Usuario SuperAdmin (Global, sin colegio)
        String emailAdmin = "superadmin@omnissaas.com";
        Optional<UsuarioEntity> adminExistente = usuarioRepository.findByEmail(emailAdmin);

        if (adminExistente.isEmpty()) {
            RolEntity rolEntitySuperAdmin = rolRepository.findByNombre("SUPERADMIN").orElseThrow();

            UsuarioEntity superAdmin = new UsuarioEntity();
            superAdmin.setEmail(emailAdmin);
            superAdmin.setPasswordHash(passwordEncoder.encode("Admin123!"));
            superAdmin.setColegio(null); // <-- AQUÍ: El SuperAdmin es global, no tiene colegio
            superAdmin.setRolEntity(rolEntitySuperAdmin);
            superAdmin.setEstado(true);

            usuarioRepository.save(superAdmin);
            log.info("Usuario SuperAdmin creado exitosamente con credenciales hasheadas.");
        } else {
            log.info("La base de datos ya cuenta con los datos iniciales requeridos.");
        }
    }
}