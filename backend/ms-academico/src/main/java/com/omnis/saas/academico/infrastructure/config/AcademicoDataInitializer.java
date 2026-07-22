package com.omnis.saas.academico.infrastructure.config;

import com.omnis.saas.academico.infrastructure.adapters.out.persistence.entity.*;
import com.omnis.saas.academico.infrastructure.adapters.out.persistence.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AcademicoDataInitializer implements CommandLineRunner {

    private final PeriodoJpaRepository periodoRepository;
    private final GradoJpaRepository gradoRepository;
    private final SeccionJpaRepository seccionRepository;
    private final CursoJpaRepository cursoRepository;
    private final EstudianteJpaRepository estudianteRepository;
    private final AsignacionJpaRepository asignacionRepository;
    private final AreaAcademicaJpaRepository areaRepository;

    @Override
    @Transactional
    public void run(String... args) {
        // Evitar duplicados si la base de datos ya tiene información
        if (periodoRepository.count() > 0) return;

        // Simulamos que el SuperAdmin ya creó esto en ms-auth
        Long colegioId = 1L;
        String docenteId = "b0c6fded-7e1a-497f-a7db-2bee2275f322";

        // 1. Crear Periodo Académico
        PeriodoEntity periodo = PeriodoEntity.builder()
                .colegioId(colegioId)
                .nombre("Bimestre 1")
                .fechaInicio(LocalDate.now().minusDays(15))
                .fechaFin(LocalDate.now().plusDays(45))
                .estado(true)
                .build();
        periodoRepository.save(periodo);

        // 2. Crear Grado
        GradoEntity grado = GradoEntity.builder()
                .colegioId(colegioId)
                .nombre("1er Año Secundaria")
                .orden(1)
                .estado(true)
                .build();
        grado = gradoRepository.save(grado);

        // 3. Crear Sección (Ajusta .grado() a .gradoId(grado.getId()) si tu entidad usa el ID en lugar del objeto)
        SeccionEntity seccion = SeccionEntity.builder()
                .colegioId(colegioId)
                .grado(grado)
                .nombre("A")
                .capacidadMaxima(30)
                .estado(true)
                .build();
        seccion = seccionRepository.save(seccion);

        // 3.5 Crear Área Académica y asignar al Docente como Coordinador
        AreaAcademicaEntity areaCiencias = AreaAcademicaEntity.builder()
                .colegioId(colegioId)
                .nombre("Ciencias y Matemáticas")
                .coordinadorId(docenteId) // ¡Nuestro docente ahora es coordinador de esta área!
                .estado(true)
                .build();
        areaCiencias = areaRepository.save(areaCiencias);

        // 4. Crear Cursos
        CursoEntity mate = CursoEntity.builder()
                .colegioId(colegioId)
                .nombre("Matemática")
                .areaAcademica(areaCiencias) // <-- Asociado al área
                .estado(true)
                .build();
        CursoEntity comu = CursoEntity.builder()
                .colegioId(colegioId)
                .nombre("Comunicación")
                .areaAcademica(areaCiencias) // <-- Asociado al área
                .estado(true)
                .build();
        mate = cursoRepository.save(mate);
        comu = cursoRepository.save(comu);

        // 5. Crear Estudiantes (Ajusta .seccion() a .seccionId() si es necesario)
        EstudianteEntity est1 = EstudianteEntity.builder()
                .colegioId(colegioId)
                .seccion(seccion)
                .nombres("Juan Carlos")
                .apellidos("Pérez López")
                .dni("70000001")
                .fechaNacimiento(LocalDate.of(2010, 5, 15))
                .estado(true)
                .build();

        EstudianteEntity est2 = EstudianteEntity.builder()
                .colegioId(colegioId)
                .seccion(seccion)
                .nombres("María Fernanda")
                .apellidos("Gómez Silva")
                .dni("70000002")
                .fechaNacimiento(LocalDate.of(2010, 8, 20))
                .estado(true)
                .build();
        estudianteRepository.saveAll(List.of(est1, est2));

        // 6. Asignar Docente a los cursos de esa sección
        AsignacionEntity asig1 = AsignacionEntity.builder()
                .colegioId(colegioId)
                .cursoId(mate.getId())
                .seccionId(seccion.getId())
                .docenteId(docenteId)
                .estado(true)
                .build();

        AsignacionEntity asig2 = AsignacionEntity.builder()
                .colegioId(colegioId)
                .cursoId(comu.getId())
                .seccionId(seccion.getId())
                .docenteId(docenteId)
                .estado(true)
                .build();
        asignacionRepository.saveAll(List.of(asig1, asig2));

        System.out.println("✅ Datos académicos iniciales cargados con éxito.");
    }
}