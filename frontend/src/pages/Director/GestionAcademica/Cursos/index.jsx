// src/pages/Director/GestionAcademica/Cursos/index.jsx
import { useState, useEffect } from "react";
import { Plus, BookOpen, Search } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";
import ModalCurso from "./ModalCurso";
import TablaCursos from "./TablaCursos";
import KpiCardsCursos from "./KpiCardsCursos";

export default function GestionCursos() {
  const [cursos, setCursos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cursoEdit, setCursoEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("TODOS");

  const fetchCursos = async () => {
    try {
      const res = await api.get("/academicos/cursos");
      setCursos(res.data);
    } catch {
      toast.error("Error al cargar los cursos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const res = await api.get("/academicos/cursos");
        if (isMounted) setCursos(res.data);
      } catch {
        if (isMounted) toast.error("Error al cargar los cursos");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const cursosFiltrados = cursos.filter((c) => {
    const matchesText =
      c.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesText) return false;

    if (filterEstado === "ACTIVOS") return c.estado === true;
    if (filterEstado === "INACTIVOS") return c.estado === false;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BookOpen size={24} style={{ color: "var(--color-primary)" }} />
            <span>Cursos (Asignaturas)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Gestiona el catálogo de materias de la institución escolar.
          </p>
        </div>

        <button
          onClick={() => {
            setCursoEdit(null);
            setShowModal(true);
          }}
          style={{ backgroundColor: "var(--color-primary)" }}
          className="w-full sm:w-auto text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-xs text-sm font-semibold"
        >
          <Plus size={18} />
          <span>Nuevo Curso</span>
        </button>
      </div>

      {/* KPI Cards */}
      <KpiCardsCursos cursos={cursos} />

      {/* Buscador + Pills de Estado */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
          />
        </div>

        {/* Pills de Filtrado */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-semibold w-full md:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setFilterEstado("TODOS")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all ${
              filterEstado === "TODOS"
                ? "bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Todos ({cursos.length})
          </button>
          <button
            onClick={() => setFilterEstado("ACTIVOS")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all ${
              filterEstado === "ACTIVOS"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Activos ({cursos.filter((c) => c.estado).length})
          </button>
          <button
            onClick={() => setFilterEstado("INACTIVOS")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all ${
              filterEstado === "INACTIVOS"
                ? "bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Inactivos ({cursos.filter((c) => !c.estado).length})
          </button>
        </div>
      </div>

      {/* Tabla Modular / Cards */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderColor: "var(--color-primary)" }}
          ></div>
        </div>
      ) : (
        <TablaCursos
          cursos={cursosFiltrados}
          onRefresh={fetchCursos}
          onEdit={(c) => {
            setCursoEdit(c);
            setShowModal(true);
          }}
        />
      )}

      {/* Modal */}
      {showModal && (
        <ModalCurso
          key={cursoEdit?.id || "nuevo"}
          onClose={() => setShowModal(false)}
          onSuccess={fetchCursos}
          curso={cursoEdit}
        />
      )}
    </div>
  );
}
