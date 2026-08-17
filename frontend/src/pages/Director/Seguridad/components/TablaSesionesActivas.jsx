// src/pages/Director/Seguridad/components/TablaSesionesActivas.jsx
import { Laptop, Globe, Clock, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function TablaSesionesActivas() {
  const sesiones = [
    {
      id: 1,
      dispositivo: "Chrome on Windows",
      ip: "190.235.12.84",
      ubicacion: "Lima, PE",
      ultimaActividad: "Activa ahora",
      esActual: true,
    },
  ];

  return (
    <div className="xl:col-span-3 bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Laptop size={18} style={{ color: "var(--color-primary)" }} />
            <span>Sesiones Activas y Auditoría</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Dispositivos que han iniciado sesión recientemente con tus
            credenciales.
          </p>
        </div>

        <button
          onClick={() => toast.success("Se han cerrado las demás sesiones")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-semibold border border-red-200 dark:border-red-900/50 px-3.5 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-all active:scale-95"
        >
          <ShieldAlert size={14} />
          <span>Cerrar las demás sesiones</span>
        </button>
      </div>

      {/* VISTA MÓVIL (Cards) - Activa en < md */}
      <div className="md:hidden space-y-2.5">
        {sesiones.map((s) => (
          <div
            key={s.id}
            className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Laptop size={16} className="text-slate-400 shrink-0" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {s.dispositivo}
                </span>
              </div>
              {s.esActual && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 rounded-full">
                  Actual
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-1 font-mono">
                <Globe size={12} className="text-slate-400" />
                <span>{s.ip}</span>
              </div>
              <div className="text-right">
                <span>{s.ubicacion}</span>
              </div>
              <div className="col-span-2 flex items-center gap-1 text-slate-400">
                <Clock size={12} />
                <span>{s.ultimaActividad}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VISTA DESKTOP (Tabla) - Activa en >= md */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80 dark:border-slate-700/80">
            <tr>
              <th className="py-3 px-4 whitespace-nowrap">Dispositivo</th>
              <th className="py-3 px-4 whitespace-nowrap">Dirección IP</th>
              <th className="py-3 px-4 whitespace-nowrap">Ubicación</th>
              <th className="py-3 px-4 whitespace-nowrap">Última Actividad</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {sesiones.map((s) => (
              <tr
                key={s.id}
                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors"
              >
                <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 whitespace-nowrap">
                  <Laptop size={16} className="text-slate-400 shrink-0" />
                  <span>{s.dispositivo}</span>
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono text-xs whitespace-nowrap">
                  {s.ip}
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">
                  {s.ubicacion}
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">
                  {s.ultimaActividad}
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  {s.esActual ? (
                    <span className="px-2.5 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 rounded-full">
                      Sesión actual
                    </span>
                  ) : (
                    <button className="text-xs text-red-600 hover:underline">
                      Cerrar sesión
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
