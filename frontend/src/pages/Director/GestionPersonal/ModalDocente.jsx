// src/pages/Director/GestionPersonal/ModalDocente.jsx
import { useState } from "react";
import { X, Save } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axiosConfig";

export default function ModalDocente({
  isOpen,
  onClose,
  onSuccess,
  docenteEdit,
}) {
  const [formData, setFormData] = useState({
    nombres: docenteEdit?.nombres || "",
    apellidos: docenteEdit?.apellidos || "",
    documentoIdentidad: docenteEdit?.documentoIdentidad || "",
    email: docenteEdit?.email || "",
    especialidad: docenteEdit?.especialidad || "",
  });

  // Guardamos el ID previo para detectar el cambio de docente durante el render sin usar useEffect
  const [prevDocenteId, setPrevDocenteId] = useState(docenteEdit?.id || null);
  const [loading, setLoading] = useState(false);

  const currentDocenteId = docenteEdit?.id || null;

  // Sincronización limpia en fase de render cuando cambia el docente seleccionado
  if (currentDocenteId !== prevDocenteId) {
    setPrevDocenteId(currentDocenteId);
    setFormData({
      nombres: docenteEdit?.nombres || "",
      apellidos: docenteEdit?.apellidos || "",
      documentoIdentidad: docenteEdit?.documentoIdentidad || "",
      email: docenteEdit?.email || "",
      especialidad: docenteEdit?.especialidad || "",
    });
  }

  if (!isOpen) return null;

  const isEditing = !!docenteEdit;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        // 👈 Incluimos explícitamente el estado actual del docente para no resetearlo
        const payload = {
          ...formData,
          estado: docenteEdit.estado,
        };
        await api.put(`/auth/docentes/${docenteEdit.id}`, payload);
        toast.success("Docente actualizado con éxito");
      } else {
        await api.post("/auth/docentes", formData);
        toast.success("Docente registrado con éxito");
      }

      onSuccess();
      onClose();
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "No se pudo completar la operación";
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {isEditing ? "Editar Docente" : "Registrar Nuevo Docente"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nombres
              </label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Apellidos
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Documento (DNI/CE)
              </label>
              <input
                type="text"
                name="documentoIdentidad"
                value={formData.documentoIdentidad}
                onChange={handleChange}
                required
                disabled={isEditing}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:outline-none text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Especialidad
              </label>
              <input
                type="text"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                placeholder="Ej. Matemáticas"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:outline-none text-sm"
            />
          </div>

          {!isEditing && (
            <div className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 p-3 rounded-lg text-xs font-medium border border-blue-100 dark:border-blue-900/50">
              Nota: La contraseña inicial del docente será su número de
              Documento (DNI/CE). El sistema le obligará a cambiarla en su
              primer inicio de sesión.
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg text-white font-semibold shadow-md hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-sm"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <Save size={16} />
              {loading
                ? "Guardando..."
                : isEditing
                  ? "Actualizar"
                  : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
