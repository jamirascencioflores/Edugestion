import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/axiosConfig";
import { Award, Lock } from "lucide-react";
import { toast } from "sonner";
import CalificacionesFilter from "./CalificacionesFilter";
import CalificacionesTable from "./CalificacionesTable";

export default function RegistroCalificaciones() {
  const { user } = useAuth();

  // Filtros y Cascada
  const [gradoId, setGradoId] = useState("");
  const [seccionId, setSeccionId] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [periodoId, setPeriodoId] = useState("");

  // Almacenamiento de catálogos y consultas reales
  const [gradosDisponibles, setGradosDisponibles] = useState([]);
  const [seccionesDisponibles, setSeccionesDisponibles] = useState([]);
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [periodosDisponibles, setPeriodosDisponibles] = useState([]);

  const [allSecciones, setAllSecciones] = useState([]);
  const [allCursos, setAllCursos] = useState([]);
  const [asignacionesDocente, setAsignacionesDocente] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [historialNotas, setHistorialNotas] = useState([]);

  // Estado para lo que escribe actualmente el docente
  const [notasEditables, setNotasEditables] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);

  // Manejadores para limpiar estados sin causar cascadas en los efectos
  const handleCambioGrado = (valor) => {
    setGradoId(valor);
    setSeccionId("");
    setCursoId("");
    setSeccionesDisponibles(
      valor
        ? allSecciones.filter(
            (s) =>
              s.gradoId?.toString() === valor.toString() ||
              s.grado?.id?.toString() === valor.toString(),
          )
        : [],
    );
    setCursosDisponibles([]);
    setAlumnos([]);
    setHistorialNotas([]);
  };

  const handleCambioSeccion = (valor) => {
    setSeccionId(valor);
    setCursoId("");
    if (!valor) {
      setCursosDisponibles([]);
      setAlumnos([]);
      setHistorialNotas([]);
    }
  };

  const handleCambioCurso = (valor) => {
    setCursoId(valor);
    if (!valor) {
      setHistorialNotas([]);
      setNotasEditables({});
    }
  };

  const handleEditar = () => {
    setModoEdicion(true); // Activamos el modo edición
    const notasPrecargadas = {};

    alumnos.forEach((alumno) => {
      const notaExistente = historialNotas.find(
        (h) =>
          h.estudianteId === alumno.id &&
          h.periodo?.toString() === periodoId?.toString(),
      );

      if (notaExistente) {
        notasPrecargadas[alumno.id] = {
          valor: notaExistente.valor,
          comentario: notaExistente.comentario || "",
        };
      }
    });

    setNotasEditables(notasPrecargadas);
  };

  // Determinar si el periodo seleccionado es editable (Bloqueo de notas pasadas)
  const esPeriodoEditable = useMemo(() => {
    if (!periodoId) return false;
    const periodoSeleccionado = periodosDisponibles.find(
      (p) => p.id?.toString() === periodoId.toString(),
    );
    return (
      periodoSeleccionado?.estado === "Activo" ||
      periodoSeleccionado?.estado === true
    );
  }, [periodoId, periodosDisponibles]);

  // 1. Carga inicial: Catálogos de la institución y asignaciones del profesor logueado
  useEffect(() => {
    const inicializarSistema = async () => {
      const docenteUuid = user?.userId;
      if (!docenteUuid) return;

      try {
        // Quitamos /auth/docentes de aquí para evitar el 403 Forbidden
        const [
          resPeriodos,
          resGrados,
          resSecciones,
          resCursos,
          resAsignaciones,
        ] = await Promise.all([
          api.get("/academicos/periodos"),
          api.get("/academicos/grados"),
          api.get("/academicos/secciones"),
          api.get("/academicos/cursos"),
          api.get(`/academicos/asignaciones/docente/${docenteUuid}`),
        ]);

        const asignaciones = resAsignaciones.data || [];
        const secciones = resSecciones.data || [];
        const grados = resGrados.data || [];

        setPeriodosDisponibles(resPeriodos.data || []);
        setAllSecciones(secciones);
        setAllCursos(resCursos.data || []);
        setAsignacionesDocente(asignaciones);

        // Filtrar qué aulas/secciones sí tienen asignaciones reales del docente
        const uniqueSeccionIds = [
          ...new Set(asignaciones.map((a) => a.seccionId)),
        ];
        const seccionesAsignadas = secciones.filter((s) =>
          uniqueSeccionIds.map(String).includes(String(s.id)),
        );

        // Extraer Grados
        const uniqueGradoIds = [
          ...new Set(seccionesAsignadas.map((s) => s.gradoId || s.grado?.id)),
        ];

        setGradosDisponibles(
          grados.filter((g) =>
            uniqueGradoIds.map(String).includes(String(g.id)),
          ),
        );

        const periodoActivo = resPeriodos.data?.find(
          (p) => p.estado === "Activo" || p.estado === true,
        );
        if (periodoActivo) {
          setPeriodoId(periodoActivo.id.toString());
        } else if (resPeriodos.data?.length > 0) {
          setPeriodoId(resPeriodos.data[0].id.toString());
        }
      } catch (error) {
        console.error("Error al inicializar filtros:", error);
        toast.error("Error al sincronizar catálogos académicos");
      }
    };

    if (user?.userId) {
      inicializarSistema();
    }
  }, [user]);

  // 2. Cascada: Al cambiar de Aula, cargamos sus alumnos y filtramos los cursos que dicta allí
  useEffect(() => {
    if (!seccionId) return;

    const cargarDatosSeccion = async () => {
      try {
        const resAlumnos = await api.get(
          `/academicos/estudiantes/seccion/${seccionId}`,
        );
        setAlumnos(resAlumnos.data || []);

        const cursosIdsEnSeccion = asignacionesDocente
          .filter((asig) => asig.seccionId.toString() === seccionId.toString())
          .map((asig) => asig.cursoId);

        const filtrados = allCursos.filter((c) =>
          cursosIdsEnSeccion.map(String).includes(String(c.id)),
        );
        setCursosDisponibles(filtrados);

        setCursoId("");
        setHistorialNotas([]);
      } catch (error) {
        console.error(error);
        toast.error("Error al consultar alumnos del aula");
      }
    };

    cargarDatosSeccion();
  }, [seccionId, asignacionesDocente, allCursos]);

  // 3. Matriz: Al seleccionar el curso, traemos las notas de todos los periodos del aula
  useEffect(() => {
    if (!cursoId) return;

    const cargarHistorialCalificaciones = async () => {
      try {
        const resNotas = await api.get(
          `/academicos/calificaciones/curso/${cursoId}/todos`,
        );
        setHistorialNotas(resNotas.data || []);
        setNotasEditables({});
      } catch (error) {
        console.error(error);
        toast.error("Error al mapear el historial de calificaciones");
      }
    };

    cargarHistorialCalificaciones();
  }, [cursoId]);

  const handleNotaChange = (estudianteId, field, value) => {
    if (!esPeriodoEditable)
      return toast.warning("Este periodo está cerrado para edición.");
    setNotasEditables((prev) => ({
      ...prev,
      [estudianteId]: { ...prev[estudianteId], [field]: value },
    }));
  };

  const handleGuardarTodo = async () => {
    // 1. Construir la lista completa
    const notasProcesadas = alumnos.map((alumno) => {
      const notaEditada = notasEditables[alumno.id];
      const notaHistorica = historialNotas.find(
        (h) =>
          h.estudianteId === alumno.id &&
          h.periodo?.toString() === periodoId?.toString(),
      );

      return {
        estudianteId: Number(alumno.id),
        cursoId: Number(cursoId),
        docenteId: user?.userId,
        periodo: String(periodoId),
        valor: (notaEditada?.valor !== undefined
          ? notaEditada.valor
          : notaHistorica?.valor || ""
        )
          .toUpperCase()
          .trim(),
        comentario:
          notaEditada?.comentario !== undefined
            ? notaEditada.comentario
            : notaHistorica?.comentario || "",
      };
    });

    // 2. Separar las que tienen nota de las vacías
    const notasParaGuardar = notasProcesadas.filter((n) => n.valor !== "");
    const cantidadFaltantes = notasProcesadas.length - notasParaGuardar.length;

    if (notasParaGuardar.length === 0) {
      return toast.error("No hay ninguna calificación válida para guardar");
    }

    try {
      await api.post("/academicos/calificaciones/masivo", notasParaGuardar);

      if (cantidadFaltantes > 0) {
        toast.warning(
          `Se guardaron ${notasParaGuardar.length} notas. Faltan ${cantidadFaltantes} estudiantes por calificar.`,
        );
      } else {
        toast.success("Todas las notas fueron guardadas correctamente");
      }

      const resNotas = await api.get(
        `/academicos/calificaciones/curso/${cursoId}/todos`,
      );
      setHistorialNotas(resNotas.data || []);
      setNotasEditables({});
      setModoEdicion(false); // Desactivamos el modo edición
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar las notas");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award
            className="w-8 h-8"
            style={{ color: "var(--color-primary)" }}
          />
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Registro de Calificaciones
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Gestión jerárquica de asignaciones y registros bimestrales.
            </p>
          </div>
        </div>

        {/* Indicador visual de bloqueo si el periodo es pasado/inactivo */}
        {periodoId && !esPeriodoEditable && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
            <Lock size={16} />
            <span className="text-sm font-semibold">Periodo Cerrado</span>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <CalificacionesFilter
          gradoId={gradoId}
          setGradoId={handleCambioGrado}
          gradosDisponibles={gradosDisponibles}
          seccionId={seccionId}
          setSeccionId={handleCambioSeccion}
          seccionesDisponibles={seccionesDisponibles}
          cursoId={cursoId}
          setCursoId={handleCambioCurso}
          cursosDisponibles={cursosDisponibles}
          periodoId={periodoId}
          setPeriodoId={setPeriodoId}
          periodosDisponibles={periodosDisponibles}
        />
        <CalificacionesTable
          alumnos={alumnos}
          periodos={periodosDisponibles}
          periodoActivo={periodoId}
          esPeriodoEditable={esPeriodoEditable}
          cursoId={cursoId}
          historialNotas={historialNotas}
          notasEditables={notasEditables}
          onNotaChange={handleNotaChange}
          onGuardar={handleGuardarTodo}
          onEditar={handleEditar}
          modoEdicion={modoEdicion}
        />
      </div>
    </div>
  );
}
