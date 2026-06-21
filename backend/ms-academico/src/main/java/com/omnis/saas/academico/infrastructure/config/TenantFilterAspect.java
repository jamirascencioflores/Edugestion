package com.omnis.saas.academico.infrastructure.config; // Ajusta según tu estructura

import com.omnis.saas.academico.infrastructure.config.tenant.TenantContext;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class TenantFilterAspect {

    @PersistenceContext
    private EntityManager entityManager;

    // IMPORTANTE: Asegúrate de que esta ruta apunte exactamente al paquete de tus servicios
    @Before("execution(* com.omnis.saas.academico.application.services.*.*(..))")
    public void enableTenantFilter() {
        Long colegioId = TenantContext.getColegioId();

        if (colegioId != null) {
            Session session = entityManager.unwrap(Session.class);
            // Activa el filtro definido en PeriodoEntity
            session.enableFilter("tenantFilter").setParameter("colegioId", colegioId);
        }
    }
}