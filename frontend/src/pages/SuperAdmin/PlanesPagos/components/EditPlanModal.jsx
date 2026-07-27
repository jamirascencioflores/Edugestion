import { X } from "lucide-react";

export default function EditPlanModal({
  plan,
  formData,
  setFormData,
  onClose,
  onSubmit,
}) {
  const modulos = [
    { key: "permitePortalPadres", label: "Portal de Padres" },
    { key: "permiteNotificaciones", label: "Notificaciones Automáticas" },
    { key: "permiteReportesPdf", label: "Reportes y PDFs Avanzados" },
    { key: "permiteMarcaBlanca", label: "Marca Blanca" },
    { key: "permiteFinanzasPro", label: "Finanzas PRO" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Editar Plan: {plan?.nombre}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Precio Mensual (S/)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.precioMensual}
              onChange={(e) =>
                setFormData({ ...formData, precioMensual: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Límite de Alumnos
            </label>
            <input
              type="number"
              value={formData.limiteAlumnos}
              onChange={(e) =>
                setFormData({ ...formData, limiteAlumnos: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2"
              required
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Permisos y Módulos
            </p>
            {modulos.map((item) => (
              <label
                key={item.key}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData[item.key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [item.key]: e.target.checked })
                  }
                  className="rounded border-slate-300 w-4 h-4"
                  style={{ accentColor: "var(--color-primary)" }}
                />
                <span className="text-sm font-medium">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
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
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
