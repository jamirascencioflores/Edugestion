package com.omnis.saas.academico.infrastructure.config.tenant;

public class TenantContext {

    private static final ThreadLocal<Long> CURRENT_TENANT = new ThreadLocal<>();

    public static void setColegioId(Long colegioId) {
        CURRENT_TENANT.set(colegioId);
    }

    public static Long getColegioId() {
        return CURRENT_TENANT.get();
    }

    public static void clear() {
        CURRENT_TENANT.remove();
    }
}