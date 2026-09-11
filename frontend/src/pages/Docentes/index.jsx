import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Users,
  Calendar,
  Sparkles,
  PenTool,
  Clock,
  ChevronRight,
  MoreVertical,
  Calculator,
  Binary,
  Brain,
  Compass,
  FileText,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

export default function DashboardDocente() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const nombreUsuario = user?.nombre || "Docente";

  const [misAsignaciones, setMisAsignaciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [grados, setGrados] = useState([]);
  const [periodoActivo, setPeriodoActivo] = useState(null);

  // Mapas con datos reales por asignación
  const [alumnosPorSeccion, setAlumnosPorSeccion] = useState({});
  const [notasPorCurso, setNotasPorCurso] = useState({});

  const [loading, setLoading] = useState(true);
  const [filtroNivel, setFiltroNivel] = useState("TODOS");

  useEffect(() => {
    let isMounted = true;

    const cargarDashboard = async () => {
      const docenteId = user?.docenteId || user?.userId || user?.id;
      if (!docenteId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. Carga de catálogos principales y periodo activo
        const [resAsig, resCur, resSec, resGrad, resPeriodos] =
          await Promise.all([
            api.get(`/academicos/asignaciones/docente/${docenteId}`),
            api.get("/academicos/cursos"),
            api.get("/academicos/secciones"),
            api.get("/academicos/grados"),
            api.get("/academicos/periodos"),
          ]);

        if (!isMounted) return;

        const asignacionesData = resAsig.data || [];
        const periodosData = resPeriodos.data || [];

        setMisAsignaciones(asignacionesData);
        setCursos(resCur.data || []);
        setSecciones(resSec.data || []);
        setGrados(resGrad.data || []);

        // Detectar periodo activo (ej. Bimestre 3)
        const activo = periodosData.find(
          (p) =>
            String(p.estado).toUpperCase() === "ACTIVO" || p.estado === true,
        );
        const periodoActual = activo || periodosData[0] || null;
        setPeriodoActivo(periodoActual);

        // 2. Consultar estudiantes reales de cada sección asignada
        const seccionIdsUnicas = [
          ...new Set(asignacionesData.map((a) => a.seccionId)),
        ];
        const resAlumnosPorSec = await Promise.all(
          seccionIdsUnicas.map(async (secId) => {
            try {
              const res = await api.get(
                `/academicos/estudiantes/seccion/${secId}`,
              );
              return { secId, estudiantes: res.data || [] };
            } catch {
              return { secId, estudiantes: [] };
            }
          }),
        );

        const mapaAlumnos = {};
        resAlumnosPorSec.forEach((item) => {
          mapaAlumnos[item.secId] = item.estudiantes;
        });

        // 3. Consultar notas de cada curso asignado para calcular el avance real
        const cursoIdsUnicos = [
          ...new Set(asignacionesData.map((a) => a.cursoId)),
        ];
        const resNotasPorCur = await Promise.all(
          cursoIdsUnicos.map(async (curId) => {
            try {
              const res = await api.get(
                `/academicos/calificaciones/curso/${curId}/todos`,
              );
              return { curId, notas: res.data || [] };
            } catch {
              return { curId, notas: [] };
            }
          }),
        );

        const mapaNotas = {};
        resNotasPorCur.forEach((item) => {
          mapaNotas[item.curId] = item.notas;
        });

        if (isMounted) {
          setAlumnosPorSeccion(mapaAlumnos);
          setNotasPorCurso(mapaNotas);
        }
      } catch (error) {
        console.error("Error al cargar dashboard docente:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    cargarDashboard();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Consolidar asignaciones con nombres, total de alumnos y porcentaje de avance
  const asignacionesCompletas = useMemo(() => {
    return misAsignaciones.map((asig) => {
      const curso = cursos.find((c) => String(c.id) === String(asig.cursoId));
      const seccion = secciones.find(
        (s) => String(s.id) === String(asig.seccionId),
      );
      const grado = grados.find(
        (g) => String(g.id) === String(seccion?.gradoId || seccion?.grado?.id),
      );

      // Lista de alumnos de esta sección específica
      const estudiantesDelAula = alumnosPorSeccion[asig.seccionId] || [];
      const totalAlumnos = estudiantesDelAula.length;
      const idsAlumnosDelAula = new Set(
        estudiantesDelAula.map((e) => String(e.id)),
      );

      // Filtrar solo notas que pertenezcan a los alumnos DE ESTA AULA en el periodo activo
      const notasDelCurso = notasPorCurso[asig.cursoId] || [];
      const notasAulaPeriodoActivo = periodoActivo
        ? notasDelCurso.filter(
            (n) =>
              idsAlumnosDelAula.has(String(n.estudianteId)) &&
              String(n.periodo) === String(periodoActivo.id) &&
              n.valor?.trim() !== "",
          )
        : [];

      const evaluados = notasAulaPeriodoActivo.length;
      const porcentaje =
        totalAlumnos > 0
          ? Math.min(Math.round((evaluados / totalAlumnos) * 100), 100)
          : 0;

      return {
        id: asig.id,
        cursoId: asig.cursoId,
        seccionId: asig.seccionId,
        cursoNombre: curso?.nombre || `Curso #${asig.cursoId}`,
        seccionNombre: seccion?.nombre || `Sección #${asig.seccionId}`,
        gradoId: grado?.id || seccion?.gradoId,
        gradoNombre: grado?.nombre || "Nivel General",
        totalAlumnos,
        evaluados,
        porcentaje,
      };
    });
  }, [
    misAsignaciones,
    cursos,
    secciones,
    grados,
    alumnosPorSeccion,
    notasPorCurso,
    periodoActivo,
  ]);

  // Métricas reales
  const metricas = useMemo(() => {
    const cursosUnicos = new Set(misAsignaciones.map((a) => a.cursoId)).size;
    const seccionesUnicas = new Set(misAsignaciones.map((a) => a.seccionId))
      .size;

    // Suma de la cantidad (.length) de estudiantes por sección
    const seccionIdsUnicas = [
      ...new Set(misAsignaciones.map((a) => a.seccionId)),
    ];
    const totalEstudiantesReales = seccionIdsUnicas.reduce(
      (acc, secId) => acc + (alumnosPorSeccion[secId]?.length || 0),
      0,
    );

    return {
      totalCursos: cursosUnicos,
      totalSecciones: seccionesUnicas,
      totalAlumnos: totalEstudiantesReales,
    };
  }, [misAsignaciones, alumnosPorSeccion]);

  // Tabs de filtro
  const tabsFiltro = useMemo(() => {
    const nombresGrados = [
      ...new Set(asignacionesCompletas.map((a) => a.gradoNombre)),
    ].filter(Boolean);
    return ["TODOS", ...nombresGrados];
  }, [asignacionesCompletas]);

  const asignacionesFiltradas = useMemo(() => {
    if (filtroNivel === "TODOS") return asignacionesCompletas;
    return asignacionesCompletas.filter((a) => a.gradoNombre === filtroNivel);
  }, [asignacionesCompletas, filtroNivel]);

  const handleCalificar = (item) => {
    navigate("/calificaciones", {
      state: {
        gradoId: item.gradoId,
        seccionId: item.seccionId,
        cursoId: item.cursoId,
        gradoNombre: item.gradoNombre,
        seccionNombre: item.seccionNombre,
        cursoNombre: item.cursoNombre,
      },
    });
  };

  const getIconoMarcaDeAgua = (nombreCurso = "") => {
    const n = nombreCurso.toLowerCase();
    if (n.includes("matem") || n.includes("álgebra") || n.includes("arit"))
      return <Calculator size={110} className="stroke-[1.2]" />;
    if (n.includes("geom") || n.includes("trigon"))
      return <Compass size={110} className="stroke-[1.2]" />;
    if (n.includes("razon") || n.includes("psico"))
      return <Brain size={110} className="stroke-[1.2]" />;
    if (n.includes("comunic") || n.includes("lengua") || n.includes("liter"))
      return <FileText size={110} className="stroke-[1.2]" />;
    if (n.includes("cien") || n.includes("físic") || n.includes("quím"))
      return <Binary size={110} className="stroke-[1.2]" />;
    return <BookOpen size={110} className="stroke-[1.2]" />;
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Header con Periodo Dinámico */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              ¡Hola de nuevo, {nombreUsuario}!
            </h1>
            <span className="text-2xl">👋</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Bienvenido a tu panel docente. Tus aulas asignadas y el periodo de
            evaluación están habilitados.
          </p>
        </div>

        {/* Badges Dinámicos */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-600">
            <Calendar size={13} className="text-blue-500" />
            Ciclo Escolar 2026
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800/60">
            <Clock size={13} className="text-purple-600 dark:text-purple-400" />
            {periodoActivo
              ? `${periodoActivo.nombre?.replace("Año Escolar ", "").replace("- 2026", "").trim()} (En Curso)`
              : "Sin Periodo Activo"}
          </div>
        </div>
      </div>

      {/* 2. KPIs de Métricas Reales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Cursos Asignados
            </p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1 font-mono">
              {loading ? "..." : metricas.totalCursos}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Materias curriculares activas
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/50">
            <BookOpen size={22} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Aulas a Cargo
            </p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1 font-mono">
              {loading ? "..." : metricas.totalSecciones}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Secciones únicas asignadas
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/50">
            <GraduationCap size={22} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Alumnos Totales
            </p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1 font-mono">
              {loading ? "..." : metricas.totalAlumnos}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Matriculados en tus secciones
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
            <Users size={22} />
          </div>
        </div>
      </div>

      {/* 3. Asignaciones con Grilla y Filtro Híbrido */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Mis Clases Asignadas ({asignacionesCompletas.length} Clases)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Selecciona un aula para calificar directamente o revisar el avance
              evaluativo.
            </p>
          </div>

          {/* Filtros Responsivos */}
          <div className="w-full sm:w-auto">
            <div className="sm:hidden w-full">
              <select
                value={filtroNivel}
                onChange={(e) => setFiltroNivel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm outline-none"
              >
                {tabsFiltro.map((tab) => (
                  <option key={tab} value={tab}>
                    {tab === "TODOS"
                      ? `Todas las Clases (${asignacionesCompletas.length})`
                      : tab}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0">
                Filtrar:
              </span>
              {tabsFiltro.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFiltroNivel(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 whitespace-nowrap ${
                    filtroNivel === tab
                      ? "text-white shadow-sm"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                  }`}
                  style={
                    filtroNivel === tab
                      ? { backgroundColor: "var(--color-primary)" }
                      : {}
                  }
                >
                  {tab === "TODOS"
                    ? `Todos (${asignacionesCompletas.length})`
                    : tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-700"
              />
            ))}
          </div>
        ) : asignacionesFiltradas.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-slate-400 text-sm font-medium">
              No se encontraron asignaciones para el filtro seleccionado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {asignacionesFiltradas.map((asig) => {
              const periodoTexto = periodoActivo
                ? periodoActivo.nombre
                    ?.replace("Año Escolar ", "")
                    .replace("- 2026", "")
                    .trim()
                : "Bimestre Activo";

              return (
                <div
                  key={asig.id}
                  className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Banner Superior con Marca de Agua */}
                  <div
                    className="p-6 text-white relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, var(--color-primary) 0%, rgba(15, 23, 42, 0.65) 100%)`,
                      backgroundColor: "var(--color-primary)",
                    }}
                  >
                    <div className="absolute -right-3 -bottom-5 text-white/15 pointer-events-none select-none">
                      {getIconoMarcaDeAgua(asig.cursoNombre)}
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur-md border border-white/20 text-white">
                          {asig.gradoNombre} • Sección {asig.seccionNombre}
                        </span>
                        <button
                          className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                          title="Opciones"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>

                      <h3 className="text-2xl font-black tracking-tight drop-shadow-sm min-h-[3rem] line-clamp-2 pr-10">
                        {asig.cursoNombre}
                      </h3>
                    </div>
                  </div>

                  {/* Cuerpo: Alumnos y Avance de Calificaciones Real */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Users size={14} className="text-slate-400" />
                          {asig.totalAlumnos} Alumnos inscritos
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {periodoTexto}
                        </span>
                      </div>

                      {/* Progreso Real */}
                      <div>
                        <div className="flex justify-between items-center text-[11px] font-medium text-slate-500 mb-1.5">
                          <span className="flex items-center gap-1">
                            Avance Calificaciones {periodoTexto}
                            <Sparkles size={12} className="text-amber-500" />
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {asig.totalAlumnos === 0
                              ? "Sin alumnos"
                              : asig.porcentaje === 100
                                ? "100% (Listo)"
                                : asig.evaluados === 0
                                  ? `Sin iniciar (0/${asig.totalAlumnos})`
                                  : `${asig.evaluados}/${asig.totalAlumnos} Evaluados`}
                          </span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${asig.porcentaje}%`,
                              backgroundColor:
                                asig.porcentaje === 100
                                  ? "#10b981"
                                  : "var(--color-primary)",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCalificar(asig)}
                      className="w-full mt-2 py-3 px-4 rounded-2xl text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] group"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      <PenTool size={16} />
                      <span>Calificar Alumnos</span>
                      <ChevronRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
