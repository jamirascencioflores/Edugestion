import { Laptop } from "lucide-react";
import { toast } from "sonner";

export default function TablaSesionesActivas() {
  return (
    <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Laptop size={18} style={{ color: "var(--color-primary)" }} />{" "}
          Sesiones Activas y Auditoría
        </h3>
        <button
          onClick={() => toast.success("Se han cerrado las demás sesiones")}
          className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-medium border border-red-200 dark:border-red-900/50 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
        >
          Cerrar todas las demás sesiones
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-slate-200 dark:border-slate-700 text-xs uppercase font-medium">
              <th className="py-3 px-4">Dispositivo</th>
              <th className="py-3 px-4">Dirección IP</th>
              <th className="py-3 px-4">Ubicación</th>
              <th className="py-3 px-4">Última Actividad</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            <tr>
              <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Laptop size={16} className="text-slate-400" /> Chrome on
                Windows
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">
                  Sesión actual
                </span>
              </td>
              <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono">
                190.235.12.84
              </td>
              <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                Lima, PE
              </td>
              <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                Activa ahora
              </td>
              <td className="py-3 px-4 text-right">
                <span className="text-xs text-slate-400 font-medium">
                  Actual
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
