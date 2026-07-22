import { useState } from "react";
import { X, Save } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";

export default function ModalAsignacion({
  onClose,
  onSuccess,
  seccionId,
  cursos,
  docentes,
  asignacion,
  asignaciones = [], // <-- Añadido para validar existencia
}) {
  const [formData, setFormData] = useState({
    id: asignacion?.id || null,
    seccionId: seccionId,
    cursoId: asignacion?.cursoId || "",
    docenteId: asignacion?.docenteId || "",
    estado: asignacion ? asignacion.estado : true,
  });

  const [initialData] = useState({ ...formData });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (JSON.stringify(formData) === JSON.stringify(initialData)) {
      toast.info("No se detectaron cambios");
      onClose();
      return;
    }

    setLoading(true);
    try {
      // 1. Buscamos si ya existe una asignación para este curso en la sección
      const asignacionExistente = asignaciones.find(
        (a) => a.cursoId === formData.cursoId,
      );

      // Usamos el ID de la asignación existente (si se intentó crear uno duplicado) o el que viene por prop al editar
      const idActualizar = asignacionExistente?.id || formData.id;

      if (idActualizar) {
        // 2. Si existe, actualizamos usando PUT
        await api.put(`/academicos/asignaciones/${idActualizar}`, formData);
        toast.success("Asignación actualizada con éxito");
      } else {
        // 3. Si no existe, creamos con POST
        await api.post("/academicos/asignaciones", formData);
        toast.success("Curso asignado correctamente");
      }

      onSuccess();
      onClose();
    } catch {
      toast.error("Error al procesar la asignación curricular");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {asignacion ? "Editar Asignación" : "Asignar Curso"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Curso
            </label>
            <select
              required
              disabled={!!asignacion}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-700"
              value={formData.cursoId}
              onChange={(e) =>
                setFormData({ ...formData, cursoId: Number(e.target.value) })
              }
            >
              <option value="">-- Seleccione Curso --</option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Docente Dictante
            </label>
            <select
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.docenteId}
              onChange={(e) =>
                setFormData({ ...formData, docenteId: e.target.value })
              }
            >
              <option value="">-- Seleccione Docente --</option>
              {docentes.map((d) => (
                <option key={d.id} value={d.usuarioId}>
                  {d.nombres} {d.apellidos}
                </option>
              ))}
            </select>
          </div>

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
              <Save size={18} /> {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
