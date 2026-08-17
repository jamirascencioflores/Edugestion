//src/pages/Director/ReporteMorosos/TablaMorosos.jsx
import { UserCheck, MessageCircle, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TablaMorosos({ morosos = [] }) {
  const navigate = useNavigate();

  const enviarWhatsApp = (item) => {
    const telefono = item.telefonoApoderado || "51999999999";
    const apoderadoNombre = item.nombreApoderado || "Apoderado(a)";
    const mensaje = encodeURIComponent(
      `Estimado(a) ${apoderadoNombre}, le saludamos de EduGestión. Le recordamos amablemente que el estudiante ${item.nombreEstudiante} registra ${item.mesesAtrasados} mes(es) de pensión pendiente por un total de S/ ${item.montoTotalDeuda?.toFixed(2)}. Agradeceremos regularizar su pago en caja.`,
    );
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, "_blank");
  };

  if (morosos.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
        No hay deudas registradas con los criterios seleccionados.
      </div>
    );
  }

  return (
    <>
      {/* VISTA MÓVIL (Cards) - Se activa en pantallas < lg */}
      <div className="lg:hidden space-y-3">
        {morosos.map((item) => {
          const iniciales = item.nombreEstudiante
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("");

          return (
            <div
              key={item.estudianteId}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3"
            >
              {/* Header: Alumno y Badge Meses */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {iniciales}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                      {item.nombreEstudiante}
                    </p>
                    <p className="text-xs text-slate-400">
                      DNI: <span className="font-mono">{item.dni}</span>
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/60 shrink-0">
                  {item.mesesAtrasados} mes(es)
                </span>
              </div>

              {/* Grado y Apoderado */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Ubicación:</span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                    {item.gradoSeccion}
                  </span>
                </div>

                {item.nombreApoderado ? (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <UserCheck size={13} className="text-indigo-500" />{" "}
                      Apoderado:
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                      {item.nombreApoderado}{" "}
                      {item.telefonoApoderado && `(${item.telefonoApoderado})`}
                    </span>
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 italic">
                    Sin apoderado asignado
                  </p>
                )}
              </div>

              {/* Conceptos y Monto Total */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1 max-w-[60%]">
                  {item.mesesPendientes?.slice(0, 2).map((concepto, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-medium truncate"
                    >
                      {concepto.replace("Pensión ", "").replace(" - 2026", "")}
                    </span>
                  ))}
                  {item.mesesPendientes?.length > 2 && (
                    <span className="px-1.5 py-0.5 bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 rounded text-[10px] font-bold">
                      +{item.mesesPendientes.length - 2}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">
                    Deuda Total:
                  </span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                    S/ {item.montoTotalDeuda?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Acciones */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  onClick={() => enviarWhatsApp(item)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 rounded-xl text-xs font-semibold transition-all active:scale-95"
                >
                  <MessageCircle size={15} /> WhatsApp
                </button>
                <button
                  onClick={() => navigate("/caja")}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-95"
                >
                  <CreditCard size={15} /> Ir a Caja
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* VISTA DESKTOP (Tabla) - Se activa en pantallas >= lg */}
      <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Estudiante / Apoderado</th>
                <th className="px-6 py-4">Grado / Sección</th>
                <th className="px-6 py-4 text-center">Deuda</th>
                <th className="px-6 py-4">Conceptos Pendientes</th>
                <th className="px-6 py-4 text-right">Monto Total</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
              {morosos.map((item) => (
                <tr
                  key={item.estudianteId}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {item.nombreEstudiante
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div className="space-y-1">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-100 leading-tight">
                            {item.nombreEstudiante}
                          </p>
                          <p className="text-xs text-slate-400">
                            DNI: {item.dni}
                          </p>
                        </div>

                        {item.nombreApoderado ? (
                          <div className="flex items-center gap-1.5 pt-1 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700">
                            <UserCheck
                              size={13}
                              className="text-indigo-500 shrink-0"
                            />
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {item.nombreApoderado}
                            </span>
                            {item.telefonoApoderado && (
                              <span className="text-slate-400 text-[11px]">
                                ({item.telefonoApoderado})
                              </span>
                            )}
                          </div>
                        ) : (
                          <p className="text-[11px] text-amber-600 dark:text-amber-400 italic pt-0.5">
                            Sin apoderado asignado
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-block px-3 py-1 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                      {item.gradoSeccion}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/60">
                      {item.mesesAtrasados} mes(es)
                    </span>
                  </td>

                  <td className="px-6 py-4 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {item.mesesPendientes
                        ?.slice(0, 3)
                        .map((concepto, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[11px] font-medium"
                          >
                            {concepto
                              .replace("Pensión ", "")
                              .replace(" - 2026", "")}
                          </span>
                        ))}
                      {item.mesesPendientes?.length > 3 && (
                        <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 rounded text-[11px] font-bold">
                          +{item.mesesPendientes.length - 3} más
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right font-extrabold text-slate-900 dark:text-white text-base whitespace-nowrap font-mono">
                    S/ {item.montoTotalDeuda?.toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => enviarWhatsApp(item)}
                        className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-all"
                        title="Enviar aviso por WhatsApp"
                      >
                        <MessageCircle size={15} />
                      </button>
                      <button
                        onClick={() => navigate("/caja")}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1"
                      >
                        <CreditCard size={14} /> Cobrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
