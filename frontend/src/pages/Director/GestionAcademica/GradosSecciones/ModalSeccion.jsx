import { useState } from "react";
import { X, Save, Lock } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";

export default function ModalSeccion({
  onClose,
  onSuccess,
  seccion,
  grados,
  gradoDefaultId,
}) {
  // Inicialización perezosa de formData
  const [formData, setFormData] = useState(() => ({
    nombre: seccion?.nombre || "",
    capacidadMaxima: seccion?.capacidadMaxima || 30,
    gradoId: seccion?.gradoId || seccion?.grado?.id || gradoDefaultId || "",
    estado: seccion ? seccion.estado : true,
  }));

  const [loading, setLoading] = useState(false);

  // Determina si el selector de grado debe estar bloqueado
  const isGradoBloqueado = Boolean(gradoDefaultId || seccion);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
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
          {/* Nombre de Sección */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nombre (Ej: A, B, Única)
            </label>
            <input
              type="text"
              required
              placeholder="Ej: A"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
          </div>

          {/* Selector de Grado (Bloqueado si se añade desde tarjeta) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Grado Perteneciente
              </label>
              {isGradoBloqueado && (
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <Lock size={12} /> Asignado por contexto
                </span>
              )}
            </div>

            <select
              required
              disabled={isGradoBloqueado}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-700/60 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed"
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

          {/* Capacidad Máxima */}
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

          {/* Checkbox Estado si es edición */}
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
              className="px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-colors hover:opacity-90 disabled:opacity-50 shadow-sm font-medium"
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
