package com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository;

import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.ConfiguracionGlobalEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfiguracionGlobalJpaRepository extends JpaRepository<ConfiguracionGlobalEntity, Long> {

    // Como solo habrá una fila de configuración, creamos un método rápido para traerla
    default ConfiguracionGlobalEntity obtenerConfiguracion() {
        return findAll().stream().findFirst().orElseGet(() -> {
            // Si no existe, la creamos por defecto apagada
            ConfiguracionGlobalEntity config = new ConfiguracionGlobalEntity();
            config.setModoMantenimiento(false);
            config.setMensajeMantenimiento("El sistema se encuentra en mantenimiento. Volveremos pronto.");
            return save(config);
        });
    }
}