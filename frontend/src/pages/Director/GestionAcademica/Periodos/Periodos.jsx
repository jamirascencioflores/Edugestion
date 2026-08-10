import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Calendar,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Lock,
  Zap,
  Search,
  Filter,
} from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";
import ModalPeriodo from "./ModalPeriodo";
import ModalAutogenerar from "./ModalAutogenerar";

export default function Periodos() {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [anioFiltro, setAnioFiltro] = useState(
    new Date().getFullYear().toString(),
  );
  const [busqueda, setBusqueda] = useState("");

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(null);

  const fetchPeriodos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/academicos/periodos");
      setPeriodos(response.data);
    } catch {
      toast.error("Error al cargar los periodos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const cargar = async () => {
      setLoading(true);
      try {
        const response = await api.get("/academicos/periodos");
        if (!ignore) setPeriodos(response.data);
      } catch {
        if (!ignore) toast.error("Error al cargar los periodos");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    cargar();
    return () => {
      ignore = true;
    };
  }, []);

  // 1. Obtener lista de años únicos disponibles para el Dropdown
  const aniosDisponibles = useMemo(() => {
    const anios = new Set(
      periodos.map((p) =>
        p.fechaInicio ? new Date(p.fechaInicio).getFullYear().toString() : "",
      ),
    );
    anios.add(new Date().getFullYear().toString());
    return Array.from(anios)
      .filter(Boolean)
      .sort((a, b) => b - a);
  }, [periodos]);

  // 2. Filtrar y ORDENAR ESTRICTAMENTE por fechaInicio ASC
  const periodosFiltrados = useMemo(() => {
    return periodos
      .filter((p) => {
        const anioP = p.fechaInicio
          ? new Date(p.fechaInicio).getFullYear().toString()
          : "";
        const coincideAnio = !anioFiltro || anioP === anioFiltro;
        const coincideBusqueda = p.nombre
          .toLowerCase()
          .includes(busqueda.toLowerCase());
        return coincideAnio && coincideBusqueda;
      })
      .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)); // 👈 Orden garantizado por fecha
  }, [periodos, anioFiltro, busqueda]);

  // Periodo activo actual en el año seleccionado
  const periodoActivoActual = useMemo(() => {
    return periodosFiltrados.find((p) => p.estado === "ACTIVO");
  }, [periodosFiltrados]);

  const openModal = (periodo = null) => {
    setPeriodoSeleccionado(periodo);
    setIsModalOpen(true);
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await api.patch(
        `/academicos/periodos/${id}/estado?estado=${nuevoEstado}`,
      );
      toast.success(`Estado actualizado a ${nuevoEstado}`);
      fetchPeriodos();
    } catch {
      toast.error("Error al cambiar el estado del periodo");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el periodo y no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: document.documentElement.classList.contains("dark")
        ? "#1e293b"
        : "#ffffff",
      color: document.documentElement.classList.contains("dark")
        ? "#fff"
        : "#1e293b",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/academicos/periodos/${id}`);
        toast.success("Periodo eliminado correctamente");
        fetchPeriodos();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error al eliminar el periodo",
        );
      }
    }
  };

  const renderBadgeEstado = (p) => {
    switch (p.estado) {
      case "ACTIVO":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200">
            <CheckCircle2 size={13} /> Activo
          </span>
        );
      case "PENDIENTE":
        return (
          <button
            onClick={() => handleCambiarEstado(p.id, "ACTIVO")}
            title="Haz clic para activar este periodo"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 transition-colors cursor-pointer"
          >
            <Clock size={13} /> Pendiente (Activar)
          </button>
        );
      case "CERRADO":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200">
            <Lock size={13} /> Cerrado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* CABECERA PRINCIPAL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Calendar style={{ color: "var(--color-primary)" }} />
            Periodos Académicos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestiona los bimestres, trimestres y ciclo escolar de tu
            institución.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAutoModalOpen(true)}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm"
          >
            <Zap size={18} />
            Autogenerar
          </button>

          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:opacity-90"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Plus size={18} />
            Nuevo Periodo
          </button>
        </div>
      </div>

      {/* CARDS RESUMEN DEL AÑO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Calendar size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Año Lectivo Seleccionado
            </p>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {anioFiltro || "Todos"}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Periodo Activo en Curso
            </p>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {periodoActivoActual
                ? periodoActivoActual.nombre
                : "Ninguno Activo"}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total de Periodos
            </p>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {periodosFiltrados.length} Periodos
            </p>
          </div>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar periodo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={18} className="text-slate-400" />
          <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Año:
          </span>
          <select
            value={anioFiltro}
            onChange={(e) => setAnioFiltro(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
          >
            {aniosDisponibles.map((a) => (
              <option key={a} value={a}>
                Año {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLA DE PERIODOS (ORDENADA POR FECHA) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                <th className="py-4 px-6 font-medium">Nombre del Periodo</th>
                <th className="py-4 px-6 font-medium">Inicio</th>
                <th className="py-4 px-6 font-medium">Fin</th>
                <th className="py-4 px-6 font-medium">Estado</th>
                <th className="py-4 px-6 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500">
                    Cargando periodos...
                  </td>
                </tr>
              ) : periodosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500">
                    No hay periodos registrados para el año {anioFiltro}.
                    ¡Prueba autogenerar la estructura!
                  </td>
                </tr>
              ) : (
                periodosFiltrados.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-slate-800 dark:text-slate-200">
                      {p.nombre}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-mono">
                      {p.fechaInicio}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-mono">
                      {p.fechaFin}
                    </td>
                    <td className="py-4 px-6">{renderBadgeEstado(p)}</td>
                    <td className="py-4 px-6 text-right flex justify-end gap-2">
                      <button
                        onClick={() => openModal(p)}
                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={p.estado === "CERRADO"}
                        className={`p-2 transition-colors rounded-lg ${
                          p.estado === "CERRADO"
                            ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                            : "text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                        }`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalPeriodo
        key={periodoSeleccionado ? periodoSeleccionado.id : "nuevo"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        periodo={periodoSeleccionado}
        onSuccess={fetchPeriodos}
      />

      <ModalAutogenerar
        isOpen={isAutoModalOpen}
        onClose={() => setIsAutoModalOpen(false)}
        onSuccess={fetchPeriodos}
      />
    </div>
  );
}
