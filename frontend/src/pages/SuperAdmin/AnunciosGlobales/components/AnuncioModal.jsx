import { useState } from "react";
import { X } from "lucide-react";

export default function AnuncioModal({ anuncio, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    titulo: anuncio?.titulo ?? "",
    mensaje: anuncio?.mensaje ?? "",
    tipo: anuncio?.tipo ?? "INFORMATIVO",
    activo: anuncio?.activo ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
          <h3 className="text-lg font-bold">
            {anuncio ? "Editar Anuncio" : "Nuevo Anuncio Global"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Título
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Mantenimiento programado de la plataforma"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Tipo de Anuncio
            </label>
            <select
              value={formData.tipo}
              onChange={(e) =>
                setFormData({ ...formData, tipo: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-sm focus:outline-none"
            >
              <option value="INFORMATIVO">Informativo</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
              <option value="URGENTE">Urgente</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Mensaje / Detalle
            </label>
            <textarea
              required
              rows={4}
              placeholder="Escribe el mensaje detallado para la comunidad..."
              value={formData.mensaje}
              onChange={(e) =>
                setFormData({ ...formData, mensaje: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-sm focus:outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-xl text-sm font-medium transition-colors shadow-md"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {anuncio ? "Guardar Cambios" : "Publicar Anuncio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
