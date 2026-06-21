package com.omnis.saas.auth.infrastructure.adapters.in.web;

import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.ConfiguracionGlobalEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.ConfiguracionGlobalJpaRepository;
import com.omnis.saas.auth.infrastructure.adapters.in.web.aop.AuditarAccion;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/sistema")
@RequiredArgsConstructor
public class SistemaController {

    private final ConfiguracionGlobalJpaRepository configuracionRepository;

    @PutMapping("/mantenimiento")
    @AuditarAccion(accion = "CAMBIAR_MANTENIMIENTO", entidad = "ConfiguracionGlobal") // ¡Auditamos quién apaga/prende el sistema!
    public ResponseEntity<?> toggleMantenimiento(
            @RequestParam boolean activar,
            @RequestParam(required = false) String mensaje) {

        ConfiguracionGlobalEntity config = configuracionRepository.obtenerConfiguracion();
        config.setModoMantenimiento(activar);

        if (mensaje != null && !mensaje.isBlank()) {
            config.setMensajeMantenimiento(mensaje);
        } else if (activar) {
            config.setMensajeMantenimiento("El sistema se encuentra en mantenimiento. Volveremos pronto.");
        }

        configuracionRepository.save(config);

        String estado = activar ? "ACTIVADO" : "DESACTIVADO";
        return ResponseEntity.ok(Map.of(
                "mensaje", "Modo mantenimiento " + estado,
                "configuracion", config
        ));
    }
}