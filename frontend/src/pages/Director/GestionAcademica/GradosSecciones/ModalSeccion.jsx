import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";

export default function ModalSeccion({ onClose, onSuccess, seccion, grados }) {
  const [formData, setFormData] = useState({
    nombre: "",
    capacidadMaxima: 30,
    gradoId: "",
    estado: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (seccion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        nombre: seccion.nombre,
        capacidadMaxima: seccion.capacidadMaxima,
        gradoId: seccion.grado?.id || "",
        estado: seccion.estado,
      });
    }
  }, [seccion]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.gradoId) {
      toast.error("Seleccione un grado");
      return;
    }

    setLoading(true);
    try {
      if (seccion) {
        await api.put(`/academicos/secciones/${seccion.id}`, formData);
        toast.success("Sección actualizada correctamente");
      } else {
        await api.post("/academicos/secciones", formData);
        toast.success("Sección creada correctamente");
      }
      onSuccess();
      onClose();
    } catch {
      toast.error("Error al guardar la sección");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {seccion ? "Editar Sección" : "Nueva Sección"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nombre (Ej: A, B, Única)
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Grado
            </label>
            <select
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.gradoId}
              onChange={(e) =>
                setFormData({ ...formData, gradoId: Number(e.target.value) })
              }
            >
              <option value="">Seleccione un grado</option>
              {grados.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Capacidad Máxima
            </label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.capacidadMaxima}
              onChange={(e) =>
                setFormData({ ...formData, capacidadMaxima: e.target.value })
              }
            />
          </div>

          {seccion && (
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="estadoSeccion"
                style={{ accentColor: "var(--color-primary)" }}
                className="w-4 h-4"
                checked={formData.estado}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.checked })
                }
              />
              <label
                htmlFor="estadoSeccion"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Sección Activa
              </label>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "var(--color-primary)" }}
              className="px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-colors hover:opacity-90 disabled:opacity-50 shadow-sm"
            >
              <Save size={18} />
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
