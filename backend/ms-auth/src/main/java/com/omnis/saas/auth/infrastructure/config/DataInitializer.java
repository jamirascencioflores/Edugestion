package com.omnis.saas.auth.infrastructure.config;

import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.ColegioEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.DocenteEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.PlanSaasEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.RolEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.UsuarioEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.ColegioJpaRepository;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.DocenteJpaRepository;
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
    private final DocenteJpaRepository docenteRepository; // <-- Inyectamos el repositorio de docentes
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

        // 2. Crear o Actualizar Planes SaaS (3 Planes)
        // 2.1 Plan BÁSICO
        PlanSaasEntity basico = planRepository.findAll().stream()
                .filter(p -> "BÁSICO".equalsIgnoreCase(p.getNombre()))
                .findFirst()
                .orElseGet(PlanSaasEntity::new);
        basico.setNombre("BÁSICO");
        basico.setLimiteAlumnos(200);
        basico.setPrecioMensual(new BigDecimal("180.00"));
        basico.setPermitePortalPadres(false);
        basico.setPermiteNotificaciones(false);
        basico.setPermiteReportesPdf(false);
        basico.setPermiteMarcaBlanca(false);
        basico.setPermiteFinanzasPro(false);
        planRepository.save(basico);

        // 2.2 Plan ESTÁNDAR (Nuevo)
        PlanSaasEntity estandar = planRepository.findAll().stream()
                .filter(p -> "ESTÁNDAR".equalsIgnoreCase(p.getNombre()))
                .findFirst()
                .orElseGet(PlanSaasEntity::new);
        estandar.setNombre("ESTÁNDAR");
        estandar.setLimiteAlumnos(500);
        estandar.setPrecioMensual(new BigDecimal("380.00"));
        estandar.setPermitePortalPadres(false);    // App móvil exclusiva del Premium
        estandar.setPermiteNotificaciones(true);   // Avisos automáticos
        estandar.setPermiteReportesPdf(true);      // Boletas y Recibos oficiales
        estandar.setPermiteMarcaBlanca(false);
        estandar.setPermiteFinanzasPro(false);
        planRepository.save(estandar);

        // 2.3 Plan PREMIUM (Full)
        PlanSaasEntity premium = planRepository.findAll().stream()
                .filter(p -> "PREMIUM".equalsIgnoreCase(p.getNombre()))
                .findFirst()
                .orElseGet(PlanSaasEntity::new);
        premium.setNombre("PREMIUM");
        premium.setLimiteAlumnos(999999);
        premium.setPrecioMensual(new BigDecimal("690.00"));
        premium.setPermitePortalPadres(true);     // Portal + App Móvil
        premium.setPermiteNotificaciones(true);
        premium.setPermiteReportesPdf(true);
        premium.setPermiteMarcaBlanca(true);
        premium.setPermiteFinanzasPro(true);      // Morosidad PRO
        planRepository.save(premium);

        log.info("Catálogo de 3 Planes SaaS sincronizado correctamente.");

        // 3. Crear el Usuario SuperAdmin
        String emailAdmin = "superadmin@omnissaas.com";
        if (usuarioRepository.findByEmail(emailAdmin).isEmpty()) {
            RolEntity rolEntitySuperAdmin = rolRepository.findByNombre("SUPERADMIN").orElseThrow();
            UsuarioEntity superAdmin = new UsuarioEntity();
            superAdmin.setEmail(emailAdmin);
            superAdmin.setPasswordHash(passwordEncoder.encode("Admin123!"));
            superAdmin.setColegio(null);
            superAdmin.setRolEntity(rolEntitySuperAdmin);
            superAdmin.setEstado(true);
            usuarioRepository.save(superAdmin);
            log.info("Usuario SuperAdmin creado exitosamente.");
        }

        // 4. Buscar o Crear Colegio "San Pedro" por su subdominio exacto
        ColegioEntity colegio = colegioRepository.findBySubdominio("sanpedro").orElseGet(() -> {
            PlanSaasEntity planPremium = planRepository.findAll().stream()
                    .filter(p -> p.getNombre().equals("PREMIUM"))
                    .findFirst().orElseThrow();

            ColegioEntity nuevoColegio = new ColegioEntity();
            nuevoColegio.setNombre("Colegio San Pedro");
            nuevoColegio.setSubdominio("sanpedro");
            nuevoColegio.setEstado(true);
            nuevoColegio.setPlan(planPremium);
            log.info("Colegio de prueba creado por subdominio.");
            return colegioRepository.save(nuevoColegio);
        });

        // 5. Crear Director si no existe y asociarlo correctamente al colegio
        if (usuarioRepository.findByEmail("director@sanpedro.com").isEmpty()) {
            RolEntity rolAdminColegio = rolRepository.findByNombre("ADMIN_COLEGIO").orElseThrow();
            UsuarioEntity director = new UsuarioEntity();
            director.setNombreCompleto("Director Prueba");
            director.setEmail("director@sanpedro.com");
            director.setPasswordHash(passwordEncoder.encode("Director123!"));
            director.setColegio(colegio);
            director.setRolEntity(rolAdminColegio);
            director.setEstado(true);
            usuarioRepository.save(director);
            log.info("Cuenta de Director creada y vinculada.");
        }

        // 6. Crear Docente y su perfil asegurando la vinculación exacta al colegio
        if (usuarioRepository.findByEmail("docente@sanpedro.com").isEmpty()) {
            RolEntity rolDocente = rolRepository.findByNombre("DOCENTE").orElseThrow();

            UsuarioEntity docenteUser = new UsuarioEntity();
            docenteUser.setNombreCompleto("Profesor Prueba");
            docenteUser.setEmail("docente@sanpedro.com");
            docenteUser.setPasswordHash(passwordEncoder.encode("Docente123!"));
            docenteUser.setColegio(colegio);
            docenteUser.setRolEntity(rolDocente);
            docenteUser.setEstado(true);
            UsuarioEntity usuarioGuardado = usuarioRepository.save(docenteUser);

            DocenteEntity docenteEntity = DocenteEntity.builder()
                    .nombres("Profesor")
                    .apellidos("Prueba")
                    .documentoIdentidad("87654321")
                    .email("docente@sanpedro.com")
                    .especialidad("Matemáticas")
                    .colegio(colegio)
                    .usuarioEntity(usuarioGuardado)
                    .estado(true)
                    .build();

            docenteRepository.save(docenteEntity);
            log.info("Cuenta de Docente y perfil vinculados al colegio correctamente.");
        }
    }
}