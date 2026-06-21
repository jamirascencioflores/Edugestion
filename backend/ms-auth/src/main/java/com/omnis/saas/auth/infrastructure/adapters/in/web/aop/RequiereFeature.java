package com.omnis.saas.auth.infrastructure.adapters.in.web.aop;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiereFeature {
    // Definimos qué funcionalidad requiere el endpoint (ej: "REPORTES_PDF")
    String value();
}