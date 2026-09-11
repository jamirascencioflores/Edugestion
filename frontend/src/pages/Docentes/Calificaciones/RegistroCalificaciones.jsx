import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/axiosConfig";
import {
  ArrowLeft,
  Save,
  SlidersHorizontal,
  ChevronDown,
  CheckCircle2,
  Lock,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import CalificacionesFilter from "./CalificacionesFilter";
import CalificacionesTable from "./CalificacionesTable";

export default function RegistroCalificaciones() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Memorizar stateNav para evitar renders innecesarios en hooks dependientes
  const stateNav = useMemo(() => location.state || {}, [location.state]);

  const [gradoId, setGradoId] = useState(
    stateNav.gradoId ? String(stateNav.gradoId) : "",
  );
  const [seccionId, setSeccionId] = useState(
    stateNav.seccionId ? String(stateNav.seccionId) : "",
  );
  const [cursoId, setCursoId] = useState(
    stateNav.cursoId ? String(stateNav.cursoId) : "",
  );
  const [periodoId, setPeriodoId] = useState("");

  const [showFiltros, setShowFiltros] = useState(!stateNav.cursoId);

  // Catálogos
  const [gradosDisponibles, setGradosDisponibles] = useState([]);
  const [seccionesDisponibles, setSeccionesDisponibles] = useState([]);
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [periodosDisponibles, setPeriodosDisponibles] = useState([]);

  const [allSecciones, setAllSecciones] = useState([]);
  const [allCursos, setAllCursos] = useState([]);
  const [asignacionesDocente, setAsignacionesDocente] = useState([]);

  // Datos de trabajo
  const [alumnos, setAlumnos] = useState([]);
  const [historialNotas, setHistorialNotas] = useState([]);
  const [notasEditables, setNotasEditables] = useState({});
  const [guardando, setGuardando] = useState(false);

  // 1. Carga inicial de catálogos y periodos
  useEffect(() => {
    let isMounted = true;
    const inicializar = async () => {
      const docenteUuid = user?.docenteId || user?.userId || user?.id;
      if (!docenteUuid) return;

      try {
        const [resPeriodos, resGrados, resSec, resCur, resAsig] =
          await Promise.all([
            api.get("/academicos/periodos"),
            api.get("/academicos/grados"),
            api.get("/academicos/secciones"),
            api.get("/academicos/cursos"),
            api.get(`/academicos/asignaciones/docente/${docenteUuid}`),
          ]);

        if (!isMounted) return;

        const periodosRaw = resPeriodos.data || [];
        const periodos2026 = periodosRaw.filter(
          (p) => !p.nombre?.includes("2027"),
        );
        const periodosLista =
          periodos2026.length > 0 ? periodos2026 : periodosRaw;

        setPeriodosDisponibles(periodosLista);
        setAllSecciones(resSec.data || []);
        setAllCursos(resCur.data || []);
        setAsignacionesDocente(resAsig.data || []);

        const uniqueSecIds = [
          ...new Set((resAsig.data || []).map((a) => String(a.seccionId))),
        ];
        const secAsig = (resSec.data || []).filter((s) =>
          uniqueSecIds.includes(String(s.id)),
        );
        const uniqueGradIds = [
          ...new Set(secAsig.map((s) => String(s.gradoId || s.grado?.id))),
        ];

        setGradosDisponibles(
          (resGrados.data || []).filter((g) =>
            uniqueGradIds.includes(String(g.id)),
          ),
        );

        const activo = periodosLista.find(
          (p) =>
            String(p.estado).toUpperCase() === "ACTIVO" || p.estado === true,
        );
        if (activo) {
          setPeriodoId(String(activo.id));
        } else if (periodosLista.length > 0) {
          setPeriodoId(String(periodosLista[0].id));
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error al inicializar:", err);
          toast.error("Error cargando catálogos académicos");
        }
      }
    };

    inicializar();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Manejo de cambio de grado
  const handleCambioGrado = (valor) => {
    setGradoId(valor);
    setSeccionId("");
    setCursoId("");
    setSeccionesDisponibles(
      valor
        ? allSecciones.filter(
            (s) => String(s.gradoId || s.grado?.id) === String(valor),
          )
        : [],
    );
    setCursosDisponibles([]);
    setAlumnos([]);
    setHistorialNotas([]);
  };

  // Cargar estudiantes y cursos asignados para el aula seleccionada
  useEffect(() => {
    if (!seccionId) return;

    let isMounted = true;
    const cargarAlumnosYCursos = async () => {
      try {
        const resAlumnos = await api.get(
          `/academicos/estudiantes/seccion/${seccionId}`,
        );
        if (!isMounted) return;
        setAlumnos(resAlumnos.data || []);

        const cursosIds = asignacionesDocente
          .filter((asig) => String(asig.seccionId) === String(seccionId))
          .map((asig) => String(asig.cursoId));

        const filtrados = allCursos.filter((c) =>
          cursosIds.includes(String(c.id)),
        );
        setCursosDisponibles(filtrados);
      } catch (err) {
        if (isMounted) {
          console.error(err);
          toast.error("Error al cargar estudiantes del aula");
        }
      }
    };

    cargarAlumnosYCursos();
    return () => {
      isMounted = false;
    };
  }, [seccionId, asignacionesDocente, allCursos]);

  // Obtener historial de notas del curso asíncronamente
  const recargarHistorialDirecto = useCallback(async (idCurso) => {
    if (!idCurso) return;
    try {
      const res = await api.get(
        `/academicos/calificaciones/curso/${idCurso}/todos`,
      );
      setHistorialNotas(res.data || []);
      setNotasEditables({});
    } catch (err) {
      console.error(err);
      toast.error("Error cargando notas del curso");
    }
  }, []);

  // Carga reactiva de notas sin setState sincrónico dentro del cuerpo inmediato del efecto
  useEffect(() => {
    if (!cursoId) return;
    let isCancelled = false;

    api
      .get(`/academicos/calificaciones/curso/${cursoId}/todos`)
      .then((res) => {
        if (!isCancelled) {
          setHistorialNotas(res.data || []);
          setNotasEditables({});
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error(err);
          toast.error("Error cargando notas del curso");
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [cursoId]);

  // Datos legibles para la barra superior
  const infoActual = useMemo(() => {
    const curso = allCursos.find((c) => String(c.id) === String(cursoId));
    const seccion = allSecciones.find(
      (s) => String(s.id) === String(seccionId),
    );
    const grado = gradosDisponibles.find(
      (g) =>
        String(g.id) ===
        String(gradoId || seccion?.gradoId || seccion?.grado?.id),
    );

    return {
      cursoNombre:
        curso?.nombre || stateNav.cursoNombre || "Selecciona un curso",
      seccionNombre: seccion?.nombre || stateNav.seccionNombre || "-",
      gradoNombre: grado?.nombre || stateNav.gradoNombre || "-",
    };
  }, [
    allCursos,
    allSecciones,
    gradosDisponibles,
    cursoId,
    seccionId,
    gradoId,
    stateNav,
  ]);

  const periodoObjActivo = useMemo(() => {
    return periodosDisponibles.find((p) => String(p.id) === String(periodoId));
  }, [periodosDisponibles, periodoId]);

  const esPeriodoAbierto = Boolean(
    String(periodoObjActivo?.estado).toUpperCase() === "ACTIVO" ||
    periodoObjActivo?.estado === true,
  );

  const cambiosPendientes = useMemo(() => {
    return Object.values(notasEditables).filter(
      (n) => n?.valor !== undefined && n?.valor !== "",
    ).length;
  }, [notasEditables]);

  const handleNotaChange = (estudianteId, field, value) => {
    if (!esPeriodoAbierto) {
      toast.warning("Este periodo está cerrado para edición.");
      return;
    }
    setNotasEditables((prev) => ({
      ...prev,
      [estudianteId]: { ...prev[estudianteId], [field]: value },
    }));
  };

  const handleGuardarTodo = async () => {
    if (!cursoId || !periodoId) {
      return toast.error("Selecciona aula, curso y periodo antes de guardar");
    }

    const payload = alumnos
      .map((alumno) => {
        const editada = notasEditables[alumno.id];
        const historica = historialNotas.find(
          (h) =>
            h.estudianteId === alumno.id &&
            String(h.periodo) === String(periodoId),
        );

        const valorFinal = (
          editada?.valor !== undefined ? editada.valor : historica?.valor || ""
        )
          .toUpperCase()
          .trim();
        const comentarioFinal =
          editada?.comentario !== undefined
            ? editada.comentario
            : historica?.comentario || "";

        return {
          estudianteId: Number(alumno.id),
          cursoId: Number(cursoId),
          docenteId: user?.docenteId || user?.userId || user?.id,
          periodo: String(periodoId),
          valor: valorFinal,
          comentario: comentarioFinal,
        };
      })
      .filter((n) => n.valor !== "");

    if (payload.length === 0) {
      return toast.warning("No hay calificaciones ingresadas para guardar.");
    }

    setGuardando(true);
    try {
      await api.post("/academicos/calificaciones/masivo", payload);
      toast.success("Calificaciones guardadas exitosamente");
      await recargarHistorialDirecto(cursoId);
      setNotasEditables({});
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.mensaje || "Error al registrar calificaciones",
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <button
        onClick={() => navigate("/docentes")}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Volver a Mis Clases
      </button>

      {/* BARRA CONTEXTUAL 100% RESPONSIVE */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
        {/* Fila 1: Título del curso y sección */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Calificando:
            </span>
            <span
              className="px-3 py-1 rounded-xl font-black text-xs sm:text-sm text-white flex items-center gap-1.5 shadow-sm"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <Layers size={14} />
              {infoActual.cursoNombre}
            </span>
            <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">
              •
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              {infoActual.gradoNombre} - Sección {infoActual.seccionNombre}
            </span>
          </div>

          {/* Botón cambiar curso */}
          <button
            onClick={() => setShowFiltros(!showFiltros)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:underline self-start sm:self-auto"
          >
            <SlidersHorizontal size={13} />
            <span>
              {showFiltros ? "Ocultar selectores" : "Cambiar Aula / Curso"}
            </span>
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${showFiltros ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Fila 2: Sub-info adaptable */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
          <span>{alumnos.length} estudiantes matriculados</span>
          <span className="hidden sm:inline">•</span>
          <span>Escala CNEB (AD - C) / Vigesimal</span>
        </div>

        {/* Fila 3: Tabs de Bimestres y Botón Guardar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
          {/* Contenedor scrolleable para móviles */}
          <div className="overflow-x-auto pb-1 max-w-full">
            <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 min-w-max">
              {periodosDisponibles.map((p) => {
                const isSelected = String(p.id) === String(periodoId);
                const esActivo =
                  String(p.estado).toUpperCase() === "ACTIVO" ||
                  p.estado === true;

                return (
                  <button
                    key={p.id}
                    onClick={() => setPeriodoId(String(p.id))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      isSelected
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {esActivo && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                    {p.nombre
                      ?.replace("Año Escolar ", "")
                      .replace("- 2026", "")
                      .trim()}
                    {isSelected && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-md uppercase font-extrabold flex items-center gap-1 ${
                          esActivo
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                            : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                        }`}
                      >
                        {esActivo ? (
                          <CheckCircle2 size={10} />
                        ) : (
                          <Lock size={10} />
                        )}
                        {esActivo ? "Abierto" : "Cerrado"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botón Guardar ancho completo en móvil */}
          <button
            onClick={handleGuardarTodo}
            disabled={guardando || !esPeriodoAbierto}
            className="w-full md:w-auto px-5 py-2.5 rounded-2xl text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Save size={16} />
            <span>{guardando ? "Guardando..." : "Guardar Calificaciones"}</span>
            {cambiosPendientes > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 font-black text-[10px]">
                {cambiosPendientes}
              </span>
            )}
          </button>
        </div>
      </div>

      {showFiltros && (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
          <CalificacionesFilter
            gradoId={gradoId}
            setGradoId={handleCambioGrado}
            gradosDisponibles={gradosDisponibles}
            seccionId={seccionId}
            setSeccionId={setSeccionId}
            seccionesDisponibles={seccionesDisponibles}
            cursoId={cursoId}
            setCursoId={setCursoId}
            cursosDisponibles={cursosDisponibles}
            periodoId={periodoId}
            setPeriodoId={setPeriodoId}
            periodosDisponibles={periodosDisponibles}
          />
        </div>
      )}

      <CalificacionesTable
        alumnos={alumnos}
        periodos={periodosDisponibles}
        periodoActivo={periodoId}
        esPeriodoEditable={esPeriodoAbierto}
        cursoId={cursoId}
        historialNotas={historialNotas}
        notasEditables={notasEditables}
        onNotaChange={handleNotaChange}
      />
    </div>
  );
}
