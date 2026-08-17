// src/pages/Director/Finanzas/Tarifarios/index.jsx
import { useState, useEffect, useCallback } from "react";
import { Plus, Wallet, Search } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import api from "../../../../api/axiosConfig";
import ModalTarifario from "./ModalTarifario";
import TablaTarifario from "./TablaTarifario";

export default function TarifariosIndex() {
  const anioActual = new Date().getFullYear();
  const [tarifarios, setTarifarios] = useState([]);
  const [grados, setGrados] = useState([]);

  // Filtros
  const [filtroAnio, setFiltroAnio] = useState(anioActual);
  const [filtroTexto, setFiltroTexto] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tarifarioEditar, setTarifarioEditar] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, [filtroAnio]);

  useEffect(() => {
    let isMounted = true;
    const loadAsyncData = async () => {
      try {
        setLoading(true);
        const [gradosRes, tarifariosRes] = await Promise.all([
          api.get("/academicos/grados"),
          api.get(`/finanzas/tarifarios/anio/${filtroAnio}`),
        ]);
        if (isMounted) {
          setGrados(gradosRes.data);
          setTarifarios(tarifariosRes.data);
        }
      } catch {
        if (isMounted) toast.error("Error al cargar los tarifarios");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAsyncData();
    return () => {
      isMounted = false;
    };
  }, [filtroAnio]);

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

  const tarifariosFiltrados = tarifarios.filter((t) => {
    const gradoObj = grados.find((g) => String(g.id) === String(t.gradoId));
    const nombreGrado = gradoObj ? gradoObj.nombre.toLowerCase() : "";
    return nombreGrado.includes(filtroTexto.toLowerCase());
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Responsivo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Wallet size={24} style={{ color: "var(--color-primary)" }} />
            <span>Tarifario de Pensiones</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configura el costo mensual de la pensión y matrícula por cada grado.
          </p>
        </div>
        <button
          onClick={() => handleAbrirModal()}
          style={{ backgroundColor: "var(--color-primary)" }}
          className="w-full sm:w-auto text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-xs text-sm font-semibold"
        >
          <Plus size={18} />
          <span>Nueva Tarifa</span>
        </button>
      </div>

      {/* Barra de Filtros Responsiva */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        {/* Buscador de Grado */}
        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por grado escolar..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
          />
        </div>

        {/* Año Escolar */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <label className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
            Año Escolar:
          </label>
          <input
            type="number"
            className="px-3 py-2 w-24 sm:w-28 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none text-sm font-semibold text-center"
            value={filtroAnio}
            onChange={(e) => setFiltroAnio(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla / Cards */}
      <TablaTarifario
        tarifarios={tarifariosFiltrados}
        grados={grados}
        loading={loading}
        onEdit={handleAbrirModal}
        onToggleStatus={handleCambiarEstado}
        onRefresh={fetchData}
      />

      {/* Modal */}
      {isModalOpen && (
        <ModalTarifario
          key={tarifarioEditar ? tarifarioEditar.gradoId : "nuevo"}
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
