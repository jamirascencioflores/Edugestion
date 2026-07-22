package com.omnis.saas.auth.application.services;

import com.omnis.saas.auth.domain.model.Colegio;
import com.omnis.saas.auth.domain.model.Docente;
import com.omnis.saas.auth.domain.model.Rol;
import com.omnis.saas.auth.domain.model.Usuario;
import com.omnis.saas.auth.domain.model.RolConstants;
import com.omnis.saas.auth.domain.ports.in.DocenteUseCase;
import com.omnis.saas.auth.domain.ports.in.UsuarioUseCase;
import com.omnis.saas.auth.domain.ports.out.ColegioRepositoryPort;
import com.omnis.saas.auth.domain.ports.out.DocenteRepositoryPort;
import com.omnis.saas.auth.domain.ports.out.RolRepositoryPort;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.DocenteActualizarDTO;
import com.omnis.saas.auth.infrastructure.adapters.in.web.dto.DocenteRegistroDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocenteServiceImpl implements DocenteUseCase {

    private final DocenteRepositoryPort docenteRepository;
    private final ColegioRepositoryPort colegioRepository;
    private final RolRepositoryPort rolRepository;
    private final UsuarioUseCase usuarioUseCase;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Docente registrarDocente(DocenteRegistroDTO dto, Long colegioId) {
        Colegio colegio = colegioRepository.findById(colegioId)
                .orElseThrow(() -> new RuntimeException("Colegio no encontrado"));

        Rol rolDocente = rolRepository.findByNombre(RolConstants.DOCENTE)
                .orElseThrow(() -> new RuntimeException("El rol DOCENTE no existe en el sistema"));

        Usuario usuarioDocente = Usuario.builder()
                .nombreCompleto(dto.nombres() + " " + dto.apellidos())
                .email(dto.email())
                .passwordHash(passwordEncoder.encode(dto.documentoIdentidad()))
                .colegio(colegio)
                .rol(rolDocente)
                .estado(true)
                .debeCambiarPassword(true)
                .createdAt(LocalDateTime.now())
                .build();

        usuarioDocente = usuarioUseCase.registrarNuevoUsuario(usuarioDocente, RolConstants.DOCENTE);

        Docente nuevoDocente = Docente.builder()
                .nombres(dto.nombres())
                .apellidos(dto.apellidos())
                .documentoIdentidad(dto.documentoIdentidad())
                .email(dto.email())
                .especialidad(dto.especialidad())
                .colegio(colegio)
                .usuario(usuarioDocente)
                .estado(true)
                .build();

        return docenteRepository.save(nuevoDocente);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Docente> listarPorColegio(Long colegioId) {
        return docenteRepository.findByColegioId(colegioId);
    }

    @Override
    @Transactional
    public Docente actualizarDocente(Long id, DocenteActualizarDTO dto, Long colegioId) {
        Docente existente = docenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Docente no encontrado"));

        if (!existente.getColegio().getId().equals(colegioId)) {
            throw new RuntimeException("No tiene permisos para modificar este docente");
        }

        existente.setNombres(dto.nombres());
        existente.setApellidos(dto.apellidos());
        existente.setDocumentoIdentidad(dto.documentoIdentidad());
        existente.setEmail(dto.email());
        existente.setEspecialidad(dto.especialidad());
        existente.setEstado(dto.estado());

        Usuario usuario = existente.getUsuario();
        if (usuario != null) {
            usuario.setNombreCompleto(dto.nombres() + " " + dto.apellidos());
            usuario.setEmail(dto.email());
            usuario.setEstado(dto.estado());
        }

        return docenteRepository.save(existente);
    }

    @Override
    @Transactional
    public void eliminarDocente(Long id, Long colegioId) {
        Docente existente = docenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Docente no encontrado"));

        if (!existente.getColegio().getId().equals(colegioId)) {
            throw new RuntimeException("No tiene permisos para eliminar este docente");
        }

        docenteRepository.deleteById(id);
    }
}