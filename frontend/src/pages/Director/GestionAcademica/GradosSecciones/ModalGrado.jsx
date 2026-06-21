import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";

export default function ModalGrado({ onClose, onSuccess, grado }) {
  const [formData, setFormData] = useState({
    nombre: "",
    orden: 1, // 👈 Añadimos el valor por defecto para el backend
    estado: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (grado) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        nombre: grado.nombre,
        orden: grado.orden || 1, // 👈 Cargamos el orden si estamos editando
        estado: grado.estado,
      });
    }
  }, [grado]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (grado) {
        await api.put(`/academicos/grados/${grado.id}`, formData);
        toast.success("Grado actualizado correctamente");
      } else {
        await api.post("/academicos/grados", formData);
        toast.success("Grado creado correctamente");
      }
      onSuccess();
      onClose();
    } catch {
      toast.error("Error al guardar el grado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {grado ? "Editar Grado" : "Nuevo Grado"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* 1. INPUT DEL NOMBRE DEL GRADO */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nombre del Grado
            </label>
            <input
              type="text"
              required
              placeholder="Ej: 1er Año, 5 Añitos, etc."
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
          </div>

          {/* 2. NUEVO SELECTOR DE NIVEL (Backend lee números, Frontend muestra texto) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nivel Educativo (Orden)
            </label>
            <select
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.orden}
              onChange={(e) =>
                setFormData({ ...formData, orden: Number(e.target.value) })
              }
            >
              <optgroup label="Nivel Inicial">
                <option value={1}>Inicial - 3 Años</option>
                <option value={2}>Inicial - 4 Años</option>
                <option value={3}>Inicial - 5 Años</option>
              </optgroup>
              <optgroup label="Nivel Primaria">
                <option value={4}>1ro de Primaria</option>
                <option value={5}>2do de Primaria</option>
                <option value={6}>3ro de Primaria</option>
                <option value={7}>4to de Primaria</option>
                <option value={8}>5to de Primaria</option>
                <option value={9}>6to de Primaria</option>
              </optgroup>
              <optgroup label="Nivel Secundaria">
                <option value={10}>1ro de Secundaria</option>
                <option value={11}>2do de Secundaria</option>
                <option value={12}>3ro de Secundaria</option>
                <option value={13}>4to de Secundaria</option>
                <option value={14}>5to de Secundaria</option>
              </optgroup>
            </select>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Esto asegura que los grados aparezcan en el orden correcto en todo
              el sistema.
            </p>
          </div>

          {/* 3. CHECKBOX DE ESTADO */}
          {grado && (
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="estadoGrado"
                className="w-4 h-4 text-blue-600"
                checked={formData.estado}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.checked })
                }
              />
              <label
                htmlFor="estadoGrado"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Grado Activo
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
