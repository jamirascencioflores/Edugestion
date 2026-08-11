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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs font-semibold uppercase">
            <tr>
              <th className="px-6 py-4">Estudiante / Apoderado</th>
              <th className="px-6 py-4">Grado / Sección</th>
              <th className="px-6 py-4 text-center">Deuda</th>
              <th className="px-6 py-4">Conceptos Pendientes</th>
              <th className="px-6 py-4 text-right">Monto Total</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {morosos.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-slate-400"
                >
                  No hay deudas registradas con los criterios seleccionados.
                </td>
              </tr>
            ) : (
              morosos.map((item) => (
                <tr
                  key={item.estudianteId}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {item.nombreEstudiante
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div className="space-y-1">
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">
                            {item.nombreEstudiante}
                          </p>
                          <p className="text-xs text-slate-400">
                            DNI: {item.dni}
                          </p>
                        </div>

                        {item.nombreApoderado ? (
                          <div className="flex items-center gap-1.5 pt-1 text-xs text-slate-600 border-t border-slate-100">
                            <UserCheck
                              size={13}
                              className="text-indigo-500 shrink-0"
                            />
                            <span className="font-medium text-slate-700">
                              {item.nombreApoderado}
                            </span>
                            {item.telefonoApoderado && (
                              <span className="text-slate-400 text-[11px]">
                                ({item.telefonoApoderado})
                              </span>
                            )}
                          </div>
                        ) : (
                          <p className="text-[11px] text-amber-600 italic pt-0.5">
                            Sin apoderado asignado
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-block px-3 py-1 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
                      {item.gradoSeccion}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-600 border border-rose-100">
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
                            className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-medium"
                          >
                            {concepto
                              .replace("Pensión ", "")
                              .replace(" - 2026", "")}
                          </span>
                        ))}
                      {item.mesesPendientes?.length > 3 && (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[11px] font-bold">
                          +{item.mesesPendientes.length - 3} más
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right font-extrabold text-slate-900 text-base whitespace-nowrap">
                    S/ {item.montoTotalDeuda?.toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => enviarWhatsApp(item)}
                        className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-all"
                        title="Enviar aviso por WhatsApp"
                      >
                        <MessageCircle size={15} />
                      </button>
                      <button
                        onClick={() => navigate("/caja")}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-1"
                      >
                        <CreditCard size={14} /> Cobrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
