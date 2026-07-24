import { useState, useEffect, useCallback } from "react";
import { Plus, Wallet } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import api from "../../../../api/axiosConfig";
import ModalTarifario from "./ModalTarifario";
import TablaTarifario from "./TablaTarifario";

export default function TarifariosIndex() {
  const anioActual = new Date().getFullYear();
  const [tarifarios, setTarifarios] = useState([]);
  const [grados, setGrados] = useState([]);

  // Estados para los filtros
  const [filtroAnio, setFiltroAnio] = useState(anioActual);
  const [filtroTipo, setFiltroTipo] = useState("TODOS"); // <- NUEVO ESTADO

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tarifarioEditar, setTarifarioEditar] = useState(null);
  const [loading, setLoading] = useState(true);

  // Envolvemos fetchData en useCallback para estabilizar su referencia
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [gradosRes, tarifariosRes] = await Promise.all([
        api.get("/academicos/grados"),
        api.get(`/finanzas/tarifarios/anio/${filtroAnio}`),
      ]);
      setGrados(gradosRes.data);
      setTarifarios(tarifariosRes.data);
    } catch {
      toast.error("Error al cargar los tarifarios");
    } finally {
      setLoading(false);
    }
  }, [filtroAnio]); // Se recalcula cuando cambia filtroAnio

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const handleAbrirModal = (tarifario = null) => {
    setTarifarioEditar(tarifario);
    setIsModalOpen(true);
  };

  const handleCambiarEstado = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;
    const accion = nuevoEstado ? "Activar" : "Inactivar";

    const result = await Swal.fire({
      title: `¿${accion} tarifa?`,
      text: `El tarifario pasará a estado ${nuevoEstado ? "Activo" : "Inactivo"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-primary)",
      cancelButtonColor: "#ef4444",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.patch(
          `/finanzas/tarifarios/${id}/estado?estado=${nuevoEstado}`,
        );
        toast.success(
          `Tarifa ${nuevoEstado ? "activada" : "inactivada"} correctamente`,
        );
        fetchData();
      } catch {
        toast.error("Error al cambiar el estado");
      }
    }
  };

  // NUEVO: Lógica de filtrado en memoria
  const tarifariosFiltrados = tarifarios.filter((t) => {
    if (filtroTipo === "TODOS") return true;
    return t.tipoTarifa === filtroTipo;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1
            className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2"
            style={{ color: "var(--color-primary)" }}
          >
            <Wallet size={24} style={{ color: "var(--color-primary)" }} />
            <span className="text-slate-800 dark:text-white">
              Tarifario de Pensiones
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configura el costo mensual de la pensión y matrícula por cada grado.
          </p>
        </div>
        <button
          onClick={() => handleAbrirModal()}
          style={{ backgroundColor: "var(--color-primary)" }}
          className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:opacity-90 shadow-sm"
        >
          <Plus size={20} />
          <span>Nueva Tarifa</span>
        </button>
      </div>

      {/* NUEVO: Contenedor con múltiples filtros */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Año Escolar:
          </label>
          <input
            type="number"
            className="px-4 py-2 w-32 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
            value={filtroAnio}
            onChange={(e) => setFiltroAnio(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Tipo de Tarifa:
          </label>
          <select
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="MATRICULA">Matrícula</option>
            <option value="PENSION">Pensión</option>
          </select>
        </div>
      </div>

      <TablaTarifario
        tarifarios={tarifariosFiltrados} // <- Pasamos el arreglo ya filtrado
        grados={grados}
        loading={loading}
        onEdit={handleAbrirModal}
        onToggleStatus={handleCambiarEstado}
      />

      {isModalOpen && (
        <ModalTarifario
          onClose={() => {
            setIsModalOpen(false);
            setTarifarioEditar(null);
          }}
          onSuccess={fetchData}
          tarifarioEditar={tarifarioEditar}
        />
      )}
    </div>
  );
}
