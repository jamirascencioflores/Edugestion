import { useState } from "react";
import { X, Save } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";

export default function ModalCurso({ onClose, onSuccess, curso }) {
  // Inicializamos el estado directamente evaluando si el prop 'curso' trae datos
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {curso ? "Editar Curso" : "Nuevo Curso"}
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
              Nombre del Curso
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Matemáticas Avanzadas"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Descripción (Opcional)
            </label>
            <textarea
              rows="3"
              placeholder="Breve detalle del contenido del curso..."
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
            />
          </div>

          {curso && (
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="estadoCurso"
                style={{ accentColor: "var(--color-primary)" }}
                className="w-4 h-4"
                checked={formData.estado}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.checked })
                }
              />
              <label
                htmlFor="estadoCurso"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Curso Activo
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
              className="px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 shadow-sm"
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
