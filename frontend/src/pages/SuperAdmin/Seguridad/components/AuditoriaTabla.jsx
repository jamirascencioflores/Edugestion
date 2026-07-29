import { ShieldAlert, Terminal } from "lucide-react";

export default function AuditoriaTabla({ logs }) {
  const getAccionBadge = (accion) => {
    switch (accion?.toUpperCase()) {
      case "CREAR":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            CREAR
          </span>
        );
      case "ELIMINAR":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            ELIMINAR
          </span>
        );
      case "ACTUALIZAR":
      case "MODIFICAR":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            ACTUALIZAR
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            {accion || "INFO"}
          </span>
        );
    }
  };

  if (logs.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-700/50 w-fit mx-auto text-slate-400">
          <ShieldAlert size={32} />
        </div>
        <h3 className="text-lg font-bold">Sin eventos coincidentes</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          No se encontraron registros de auditoría que coincidan con la búsqueda
          o filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-5 py-3.5">Fecha y Hora</th>
              <th className="px-5 py-3.5">Usuario</th>
              <th className="px-5 py-3.5">Acción</th>
              <th className="px-5 py-3.5">Entidad</th>
              <th className="px-5 py-3.5">IP Origen</th>
              <th className="px-5 py-3.5">Detalle técnico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-200">
            {logs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <td className="px-5 py-3.5 whitespace-nowrap text-xs font-medium text-slate-500">
                  {log.fechaHora
                    ? new Date(log.fechaHora).toLocaleString("es-PE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "—"}
                </td>

                <td className="px-5 py-3.5 font-semibold text-xs">
                  {log.usuarioEmail || "SISTEMA"}
                </td>

                <td className="px-5 py-3.5 whitespace-nowrap">
                  {getAccionBadge(log.accion)}
                </td>

                <td className="px-5 py-3.5 font-medium text-xs">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {log.entidad || "General"}
                  </span>
                </td>

                <td className="px-5 py-3.5 font-mono text-xs text-slate-500">
                  {log.ipOrigen || "127.0.0.1"}
                </td>

                <td className="px-5 py-3.5 max-w-xs">
                  <div
                    className="flex items-center gap-1 text-xs text-slate-500 truncate"
                    title={log.detalle}
                  >
                    <Terminal size={14} className="shrink-0 text-slate-400" />
                    <span className="truncate">
                      {log.detalle || "Sin especificaciones"}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
