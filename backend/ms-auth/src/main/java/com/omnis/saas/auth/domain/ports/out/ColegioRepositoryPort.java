package com.omnis.saas.auth.domain.ports.out;

import com.omnis.saas.auth.domain.model.Colegio;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

public interface ColegioRepositoryPort {
    Colegio save(Colegio colegio);
    Optional<Colegio> findById(Long id);
    Optional<Colegio> findBySubdominio(String subdominio);
    List<Colegio> findAll();
    void deleteById(Long id);
    void delete(Colegio colegio);
    List<Colegio> buscarColegiosConSuscripcionVencida(LocalDate fechaActual);
    void guardarTodos(List<Colegio> colegios); // Para actualizar varios de golpe

    // --- NUEVOS MÉTODOS PARA MÉTRICAS DEL DASHBOARD SUPERADMIN ---
    long count();
    long countByEstado(Boolean estado);
    long countByPlan(String plan);
}