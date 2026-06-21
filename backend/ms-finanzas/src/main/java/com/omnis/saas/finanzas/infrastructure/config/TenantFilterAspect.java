package com.omnis.saas.finanzas.infrastructure.config;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.hibernate.Session;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class TenantFilterAspect {

    @PersistenceContext
    private EntityManager entityManager;

    @Before("execution(* com.omnis.saas.finanzas.infrastructure.adapters.out.persistence.repository.*.*(..))")
    public void applyTenantFilter() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String colegioIdHeader = request.getHeader("X-Colegio-Id");

            if (colegioIdHeader != null) {
                Long colegioId = Long.valueOf(colegioIdHeader);
                Session session = entityManager.unwrap(Session.class);
                session.enableFilter("tenantFilter").setParameter("colegioId", colegioId);
            }
        }
    }
}