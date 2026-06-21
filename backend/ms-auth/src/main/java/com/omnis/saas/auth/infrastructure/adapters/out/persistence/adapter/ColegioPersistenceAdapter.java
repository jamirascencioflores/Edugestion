package com.omnis.saas.auth.infrastructure.adapters.out.persistence.adapter;

import com.omnis.saas.auth.domain.model.Colegio;
import com.omnis.saas.auth.domain.ports.out.ColegioRepositoryPort;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.entity.ColegioEntity;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.mapper.ColegioMapper;
import com.omnis.saas.auth.infrastructure.adapters.out.persistence.repository.ColegioJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ColegioPersistenceAdapter implements ColegioRepositoryPort {

    private final ColegioJpaRepository colegioRepository;
    private final ColegioMapper colegioMapper;

    @Override
    public Colegio save(Colegio colegio) {
        ColegioEntity entity;

        if (colegio.getId() != null) {
            // ES UNA ACTUALIZACIÓN: Recuperamos la entidad original para no perder las relaciones (usuarios)
            entity = colegioRepository.findById(colegio.getId())
                    .orElseThrow(() -> new RuntimeException("Colegio no encontrado en BD"));

            // Actualizamos la entidad original SOLO con los datos del dominio
            colegioMapper.updateEntityFromDomain(colegio, entity);
        } else {
            // ES UN REGISTRO NUEVO
            entity = colegioMapper.toEntity(colegio);
        }

        ColegioEntity savedEntity = colegioRepository.save(entity);
        return colegioMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Colegio> findById(Long id) {
        return colegioRepository.findById(id).map(colegioMapper::toDomain);
    }

    @Override
    public Optional<Colegio> findBySubdominio(String subdominio) {
        return colegioRepository.findBySubdominio(subdominio).map(colegioMapper::toDomain);
    }

    @Override
    public List<Colegio> findAll() {
        return colegioRepository.findAll().stream()
                .map(colegioMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        colegioRepository.deleteById(id);
    }

    @Override
    public void delete(Colegio colegio) {
        colegioRepository.delete(colegioMapper.toEntity(colegio));
    }

    @Override
    public List<Colegio> buscarColegiosConSuscripcionVencida(java.time.LocalDate fechaActual) {
        return colegioRepository.buscarActivosVencidos(fechaActual).stream()
                .map(colegioMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void guardarTodos(List<Colegio> colegios) {
        List<ColegioEntity> entities = colegios.stream()
                .map(colegioMapper::toEntity)
                .collect(Collectors.toList());
        colegioRepository.saveAll(entities);
    }
}