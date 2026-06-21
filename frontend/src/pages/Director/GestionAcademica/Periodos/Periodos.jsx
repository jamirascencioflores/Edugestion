// pages/Director/GestionAcademica/Periodos/Periodos.jsx

import { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";
import ModalPeriodo from "./ModalPeriodo";

export default function Periodos() {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para controlar el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(null);

  const fetchPeriodos = async () => {
    setLoading(true);
    try {
      const response = await api.get("/academicos/periodos");
      setPeriodos(response.data);
    } catch {
      toast.error("Error al cargar los periodos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPeriodos();
  }, []);

  const openModal = (periodo = null) => {
    setPeriodoSeleccionado(periodo);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el periodo y no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", // Color indigo-600 de tu tema
      cancelButtonColor: "#64748b", // Color red-500
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
      } catch {
        toast.error("Error al eliminar el periodo");
      }
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Calendar style={{ color: "var(--color-primary)" }} />
            Periodos Académicos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestiona los años escolares y ciclos de tu institución.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:opacity-90"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <Plus size={18} />
          Nuevo Periodo
        </button>
      </div>

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
              ) : periodos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500">
                    No hay periodos registrados.
                  </td>
                </tr>
              ) : (
                periodos.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-slate-800 dark:text-slate-200">
                      {p.nombre}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                      {p.fechaInicio}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                      {p.fechaFin}
                    </td>
                    <td className="py-4 px-6">
                      {p.estado ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <CheckCircle2 size={14} /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                          <XCircle size={14} /> Inactivo
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right flex justify-end gap-2">
                      <button
                        onClick={() => openModal(p)}
                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
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
        key={periodoSeleccionado ? periodoSeleccionado.id : "nuevo"} // <-- Añade esta línea
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        periodo={periodoSeleccionado}
        onSuccess={fetchPeriodos}
      />
    </div>
  );
}
