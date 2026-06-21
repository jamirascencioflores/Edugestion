import { useState, useEffect, useCallback } from "react";
import { Plus, Search, ShieldAlert, ShieldCheck } from "lucide-react";
// 1. Cambiamos axios por nuestra instancia configurada
import api from "@/api/axiosConfig";
import { toast } from "sonner";
import Swal from "sweetalert2";
import ModalRegistro from "./ModalRegistro";
import TablaColegios from "./TablaColegios";

export default function GestionColegios() {
  const [colegios, setColegios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [colegioToEdit, setColegioToEdit] = useState(null);
  const [mantenimientoActivo, setMantenimientoActivo] = useState(false);

  // 2. Simplificamos fetchColegios usando la instancia 'api'
  const fetchColegios = useCallback(async (showSpinner = true) => {
    try {
      if (showSpinner) setLoading(true);
      // Ya no necesitamos sacar el token ni configurar headers manualmente
      const response = await api.get("/auth/colegios");
      setColegios(response.data);
    } catch (err) {
      // El interceptor ya maneja el 503, aquí solo capturamos otros errores
      if (err.response?.status !== 503) {
        toast.error("No se pudo cargar la lista de colegios.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      if (isMounted) {
        await fetchColegios(false);
      }
    };
    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, [fetchColegios]);

  const handleOpenRegistro = () => {
    setColegioToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (colegio) => {
    setColegioToEdit(colegio);
    setIsModalOpen(true);
  };

  // ----------------------------------------------------
  // MODO MANTENIMIENTO GLOBAL
  // ----------------------------------------------------
  const handleToggleMantenimiento = async () => {
    const nuevoEstado = !mantenimientoActivo;

    const result = await Swal.fire({
      title: nuevoEstado
        ? "¿Activar Mantenimiento Global?"
        : "¿Desactivar Mantenimiento?",
      text: nuevoEstado
        ? "Ningún colegio podrá acceder al sistema. Todos verán la pantalla de mantenimiento."
        : "El sistema volverá a la normalidad para todos los colegios.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado ? "#ef4444" : "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: nuevoEstado
        ? "Sí, bloquear sistema"
        : "Sí, reactivar sistema",
      cancelButtonText: "Cancelar",
      background: document.documentElement.classList.contains("dark")
        ? "#1e293b"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#fff"
        : "#1e293b",
    });

    if (!result.isConfirmed) return;

    try {
      // Usamos la ruta relativa y dejamos que el interceptor maneje el resto
      const response = await api.put(
        `/auth/sistema/mantenimiento?activar=${nuevoEstado}`,
      );
      setMantenimientoActivo(nuevoEstado);
      toast.success(response.data.mensaje);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Error al cambiar estado del sistema",
      );
    }
  };

  // ----------------------------------------------------
  // CAMBIAR ESTADO DE COLEGIO
  // ----------------------------------------------------
  const handleCambiarEstado = async (id, estadoActual) => {
    const isSuspending = estadoActual;

    const result = await Swal.fire({
      title: isSuspending ? "¿Suspender colegio?" : "¿Reactivar colegio?",
      text: isSuspending
        ? "Se bloqueará el acceso a todos sus usuarios."
        : "El colegio y sus usuarios volverán a tener acceso al sistema.",
      icon: isSuspending ? "warning" : "info",
      showCancelButton: true,
      confirmButtonColor: isSuspending ? "#f59e0b" : "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: isSuspending ? "Sí, suspender" : "Sí, reactivar",
      cancelButtonText: "Cancelar",
      background: document.documentElement.classList.contains("dark")
        ? "#1e293b"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#fff"
        : "#1e293b",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await api.put(`/auth/colegios/${id}/estado`);
      toast.success(isSuspending ? "Colegio suspendido" : "Colegio reactivado");
      await fetchColegios(true);
    } catch (err) {
      toast.error(err.response?.data?.mensaje || "Error al cambiar el estado");
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // ELIMINAR COLEGIO
  // ----------------------------------------------------
  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás completamente seguro?",
      text: "Se borrará el colegio y TODOS sus datos. ¡Es irreversible!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar definitivamente",
      cancelButtonText: "Cancelar",
      background: document.documentElement.classList.contains("dark")
        ? "#1e293b"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#fff"
        : "#1e293b",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await api.delete(`/auth/colegios/${id}`);
        toast.success("Colegio eliminado definitivamente.");
        await fetchColegios(true);
      } catch (err) {
        toast.error(err.response?.data?.error || "Error al eliminar");
        setLoading(false);
      }
    }
  };

  const colegiosFiltrados = colegios.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subdominio.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* HEADER Y BUSCADOR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Gestión de Dominios
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra los colegios (tenants) y sus suscripciones.
          </p>
        </div>

        {/* ZONA DE BOTONES Y BUSCADOR */}
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar colegio o dominio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ focusRingColor: "var(--color-primary)" }}
            />
          </div>

          {/* NUEVO BOTÓN: MANTENIMIENTO */}
          <button
            onClick={handleToggleMantenimiento}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium shadow-sm transition-all ${
              mantenimientoActivo
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
            title="Activar/Desactivar Modo Mantenimiento"
          >
            {mantenimientoActivo ? (
              <ShieldCheck size={18} />
            ) : (
              <ShieldAlert size={18} />
            )}
            <span className="hidden sm:inline">
              {mantenimientoActivo ? "Sistema Pausado" : "Pausar Sistema"}
            </span>
          </button>

          {/* BOTÓN EXISTENTE: NUEVO COLEGIO */}
          <button
            onClick={handleOpenRegistro}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium shadow-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Plus size={18} />{" "}
            <span className="hidden sm:inline">Nuevo Colegio</span>
          </button>
        </div>
      </div>

      {/* TABLA DE COLEGIOS */}
      {loading ? (
        <div className="p-10 text-center text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          Cargando información de colegios...
        </div>
      ) : (
        <TablaColegios
          colegios={colegiosFiltrados}
          onEdit={handleEdit}
          onToggleEstado={handleCambiarEstado}
          onDelete={handleEliminar}
        />
      )}

      <ModalRegistro
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchColegios(true)}
        colegioEdit={colegioToEdit}
      />
    </div>
  );
}
