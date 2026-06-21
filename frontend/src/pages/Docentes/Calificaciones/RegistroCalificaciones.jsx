import { useState, useEffect, useMemo } from "react";
import { calificacionApi } from "../../../api/calificacionApi";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/axiosConfig";
import { Award, Lock } from "lucide-react";
import { toast } from "sonner";
import CalificacionesFilter from "./CalificacionesFilter";
import CalificacionesTable from "./CalificacionesTable";

export default function RegistroCalificaciones() {
  const { user } = useAuth();

  // Filtros y Cascada (Ahora incluye Grado)
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

  // Manejadores para limpiar estados sin causar cascadas en los efectos
  const handleCambioGrado = (valor) => {
    setGradoId(valor);
    setSeccionId("");
    setCursoId("");
    setSeccionesDisponibles(
      valor
        ? allSecciones.filter((s) => s.gradoId?.toString() === valor.toString())
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
      try {
        // TODO: Verifica si '1' es un ID válido en tu tabla de docentes.
        // Si usas UUIDs o textos, cámbialo temporalmente por el ID real de tu profesor de prueba, ej: "DOC-001"
        const docenteId = "b0c6fded-7e1a-497f-a7db-2bee2275f322";

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
          api.get(`/academicos/asignaciones/docente/${docenteId}`),
        ]);

        const asignaciones = resAsignaciones.data || [];
        const secciones = resSecciones.data || [];
        const grados = resGrados.data || [];

        // 🐛 DEBUG: Mira tu consola (F12) para ver si 'asignaciones' viene vacío
        console.log(
          "Asignaciones traídas para el docente",
          docenteId,
          ":",
          asignaciones,
        );
        console.log("Secciones de la BD:", secciones);

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

        // Extraer Grados (¡Mejora aquí! Soporta tanto s.gradoId como s.grado.id)
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

    inicializarSistema();
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

  const handleGuardarNota = async (estudianteId) => {
    if (!esPeriodoEditable)
      return toast.error("Periodo bloqueado por administración.");

    const cambioInput = notasEditables[estudianteId];
    if (!cursoId || !periodoId)
      return toast.error("Faltan parámetros de selección");
    if (!cambioInput?.valor)
      return toast.error("La calificación no puede estar vacía");

    try {
      await calificacionApi.registrar({
        estudianteId,
        cursoId: Number(cursoId),
        docenteId: user?.id || 1,
        periodo: periodoId,
        valor: cambioInput.valor.toUpperCase().trim(),
        comentario: cambioInput.comentario || "",
      });

      toast.success("Nota almacenada correctamente");

      const resNotas = await api.get(
        `/academicos/calificaciones/curso/${cursoId}/todos`,
      );
      setHistorialNotas(resNotas.data || []);

      setNotasEditables((prev) => {
        const copia = { ...prev };
        delete copia[estudianteId];
        return copia;
      });
    } catch (error) {
      console.error(error);
      toast.error("Error crítico de persistencia");
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
          onGuardar={handleGuardarNota}
        />
      </div>
    </div>
  );
}
