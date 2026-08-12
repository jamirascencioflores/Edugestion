// src/pages/Director/GestionAcademica/Periodos/index.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Zap,
  Search,
  Filter,
} from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";
import ModalPeriodo from "./ModalPeriodo";
import ModalAutogenerar from "./ModalAutogenerar";
import TablaPeriodos from "./TablaPeriodos";

export default function PeriodosIndex() {
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
      .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
  }, [periodos, anioFiltro, busqueda]);

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

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Calendar style={{ color: "var(--color-primary)" }} />
            Periodos Académicos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestiona los bimestres, trimestres y ciclo escolar de tu
            institución.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setIsAutoModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            <Zap size={16} />
            Autogenerar
          </button>

          <button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs hover:opacity-90"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Plus size={16} />
            Nuevo Periodo
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
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

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Periodo Activo en Curso
            </p>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate max-w-[160px]">
              {periodoActivoActual
                ? periodoActivoActual.nombre
                : "Ninguno Activo"}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
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

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-center">
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
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter size={18} className="text-slate-400" />
          <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Año:
          </span>
          <select
            value={anioFiltro}
            onChange={(e) => setAnioFiltro(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none font-semibold"
          >
            {aniosDisponibles.map((a) => (
              <option key={a} value={a}>
                Año {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista / Tabla de Periodos */}
      <TablaPeriodos
        periodos={periodosFiltrados}
        loading={loading}
        anioFiltro={anioFiltro}
        onEdit={openModal}
        onDelete={handleDelete}
        onCambiarEstado={handleCambiarEstado}
      />

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
