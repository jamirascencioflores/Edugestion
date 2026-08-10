import { useState } from "react";
import { X, Save } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";

export default function ModalCurso({ onClose, onSuccess, curso }) {
  const [formData, setFormData] = useState({
    nombre: curso?.nombre || "",
    descripcion: curso?.descripcion || "",
    estado: curso ? curso.estado : true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (curso) {
        await api.put(`/academicos/cursos/${curso.id}`, formData);
        toast.success("Curso actualizado correctamente");
      } else {
        await api.post("/academicos/cursos", formData);
        toast.success("Curso creado correctamente");
      }
      onSuccess();
      onClose();
    } catch {
      toast.error("Error al guardar el curso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {curso ? "Editar Curso" : "Nuevo Curso"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nombre del Curso
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Matemáticas Avanzadas"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:outline-none text-sm"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Descripción (Opcional)
            </label>
            <textarea
              rows="3"
              placeholder="Breve detalle del contenido del curso..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:outline-none text-sm resize-none"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
            />
          </div>

          {/* Toggle Switch Tipo Barra */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              role="switch"
              aria-checked={formData.estado}
              onClick={() =>
                setFormData((prev) => ({ ...prev, estado: !prev.estado }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                formData.estado
                  ? "bg-[var(--color-primary)]"
                  : "bg-slate-300 dark:bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.estado ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <label
              onClick={() =>
                setFormData((prev) => ({ ...prev, estado: !prev.estado }))
              }
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none"
            >
              Curso Activo
            </label>
          </div>

          {/* Footer */}
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "var(--color-primary)" }}
              className="px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 shadow-sm text-sm font-semibold"
            >
              <Save size={16} />
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
