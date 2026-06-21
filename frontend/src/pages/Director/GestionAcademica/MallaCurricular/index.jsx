import { useState, useEffect } from "react";
import { Plus, ArrowLeft, Network } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/axiosConfig";
import ModalAsignacion from "./ModalAsignacion";
import TablaAsignaciones from "./TablaAsignaciones";

export default function MallaCurricular() {
  const navigate = useNavigate();
  const [grados, setGrados] = useState([]);
  const [seccionesTotales, setSeccionesTotales] = useState([]);
  const [seccionesFiltradas, setSeccionesFiltradas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const [seccionSeleccionada, setSeccionSeleccionada] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [asignacionEdit, setAsignacionEdit] = useState(null);

  // 1. Cargar catálogos iniciales
  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const [resGrados, resSecciones, resCursos, resDocentes] =
          await Promise.all([
            api.get("/academicos/grados"),
            api.get("/academicos/secciones"),
            api.get("/academicos/cursos"),
            api.get("/auth/docentes"),
          ]);
        setGrados(resGrados.data.filter((g) => g.estado));
        setSeccionesTotales(resSecciones.data.filter((s) => s.estado));
        setCursos(resCursos.data.filter((c) => c.estado));
        setDocentes(resDocentes.data);
      } catch {
        toast.error("Error al cargar los catálogos académicos");
      }
    };
    fetchCatalogos();
  }, []);

  // 2. Filtrar secciones cuando cambie el grado
  useEffect(() => {
    if (gradoSeleccionado) {
      const filtradas = seccionesTotales.filter(
        (s) => s.gradoId === Number(gradoSeleccionado),
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSeccionesFiltradas(filtradas);
    } else {
      setSeccionesFiltradas([]);
    }
    setSeccionSeleccionada("");
    setAsignaciones([]);
  }, [gradoSeleccionado, seccionesTotales]);

  // 3. Cargar asignaciones de la sección
  const fetchAsignaciones = async (seccionId) => {
    if (!seccionId) return;
    try {
      const res = await api.get(
        `/academicos/asignaciones/seccion/${seccionId}`,
      );
      setAsignaciones(res.data);
    } catch {
      toast.error("Error al cargar la malla curricular");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (seccionSeleccionada) fetchAsignaciones(seccionSeleccionada);
  }, [seccionSeleccionada]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Network size={24} style={{ color: "var(--color-primary)" }} />
              Malla Curricular
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Distribución oficial de materias y docentes por aula
            </p>
          </div>
        </div>
      </div>

      {/* Selectores de Filtro en Línea */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Grado Académico
          </label>
          <select
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            value={gradoSeleccionado}
            onChange={(e) => setGradoSeleccionado(e.target.value)}
          >
            <option value="">-- Seleccione Grado --</option>
            {grados.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Sección / Aula
          </label>
          <select
            disabled={!gradoSeleccionado}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            value={seccionSeleccionada}
            onChange={(e) => setSeccionSeleccionada(e.target.value)}
          >
            <option value="">-- Seleccione Sección --</option>
            {seccionesFiltradas.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setAsignacionEdit(null);
            setShowModal(true);
          }}
          disabled={!seccionSeleccionada}
          style={{
            backgroundColor: seccionSeleccionada ? "var(--color-primary)" : "",
          }}
          className={`w-full md:w-auto px-4 py-2 text-white rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm ${!seccionSeleccionada ? "bg-slate-400 cursor-not-allowed opacity-50" : "hover:opacity-90"}`}
        >
          <Plus size={20} /> Asignar Curso
        </button>
      </div>

      {/* Tabla o Estado Vacío */}
      {seccionSeleccionada ? (
        <TablaAsignaciones
          asignaciones={asignaciones}
          cursos={cursos}
          docentes={docentes}
          onRefresh={() => fetchAsignaciones(seccionSeleccionada)}
          onEdit={(a) => {
            setAsignacionEdit(a);
            setShowModal(true);
          }}
        />
      ) : (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">
            Seleccione un grado y su respectiva sección para gestionar la malla.
          </p>
        </div>
      )}

      {showModal && (
        <ModalAsignacion
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchAsignaciones(seccionSeleccionada)}
          seccionId={Number(seccionSeleccionada)}
          cursos={cursos}
          docentes={docentes}
          asignacion={asignacionEdit}
        />
      )}
    </div>
  );
}
