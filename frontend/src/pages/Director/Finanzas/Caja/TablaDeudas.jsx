import {
  CheckCircle,
  Clock,
  Banknote,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import BotonDescargaRecibo from "./BotonDescargaRecibo";

export default function TablaDeudas({ deudas, onPagar, onRevertir }) {
  const getNombreMes = (deuda) => {
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    if (deuda.numeroMes) return meses[deuda.numeroMes - 1];
    if (deuda.mes) return meses[deuda.mes - 1];

    if (deuda.fechaVencimiento) {
      if (Array.isArray(deuda.fechaVencimiento)) {
        return meses[deuda.fechaVencimiento[1] - 1];
      }
      if (typeof deuda.fechaVencimiento === "string") {
        const fecha = new Date(deuda.fechaVencimiento + "T00:00:00");
        return meses[fecha.getMonth()];
      }
    }
    return "";
  };

  const esVencida = (deuda) => {
    if (deuda.estado === "PAGADA") return false;
    let fechaVenc = null;

    if (Array.isArray(deuda.fechaVencimiento)) {
      fechaVenc = new Date(
        deuda.fechaVencimiento[0],
        deuda.fechaVencimiento[1] - 1,
        deuda.fechaVencimiento[2],
      );
    } else if (typeof deuda.fechaVencimiento === "string") {
      fechaVenc = new Date(deuda.fechaVencimiento + "T00:00:00");
    }

    if (!fechaVenc) return false;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fechaVenc < hoy;
  };

  const deudasOrdenadas = [...deudas].sort(
    (a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento),
  );

  const matriculas = deudasOrdenadas.filter(
    (d) =>
      d.concepto?.toLowerCase().includes("matrícula") ||
      d.concepto?.toLowerCase().includes("matricula"),
  );

  const pensiones = deudasOrdenadas.filter(
    (d) =>
      !d.concepto?.toLowerCase().includes("matrícula") &&
      !d.concepto?.toLowerCase().includes("matricula"),
  );

  const renderTabla = (lista, titulo) => {
    if (lista.length === 0) return null;

    return (
      <div className="mb-6 last:mb-0">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
          {titulo}
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80 dark:border-slate-700/80">
              <tr>
                <th className="px-5 py-3.5">Concepto</th>
                <th className="px-5 py-3.5">Monto</th>
                <th className="px-5 py-3.5">Vencimiento</th>
                <th className="px-5 py-3.5 text-center">Estado</th>
                <th className="px-5 py-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {lista.map((d) => {
                const estaVencida = esVencida(d);

                return (
                  <tr
                    key={d.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    {/* Concepto */}
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800 dark:text-slate-100">
                        {d.concepto
                          ? d.concepto
                          : `Pensión ${getNombreMes(d)} ${d.anioEscolar}`}
                      </p>
                      {d.numeroOperacion && (
                        <span className="text-xs text-slate-400 block mt-0.5 font-medium">
                          Op: {d.numeroOperacion}
                        </span>
                      )}
                    </td>

                    {/* Monto */}
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                      <span
                        className={
                          estaVencida ? "text-red-600 dark:text-red-400" : ""
                        }
                      >
                        S/ {Number(d.monto).toFixed(2)}
                      </span>
                    </td>

                    {/* Vencimiento */}
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                      {Array.isArray(d.fechaVencimiento)
                        ? `${d.fechaVencimiento[2].toString().padStart(2, "0")}/${d.fechaVencimiento[1].toString().padStart(2, "0")}/${d.fechaVencimiento[0]}`
                        : new Date(
                            d.fechaVencimiento + "T00:00:00",
                          ).toLocaleDateString()}
                    </td>

                    {/* Estado */}
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          d.estado === "PAGADA"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60"
                            : estaVencida
                              ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200/60 dark:border-red-800/60"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60"
                        }`}
                      >
                        {d.estado === "PAGADA" ? (
                          <CheckCircle size={12} />
                        ) : estaVencida ? (
                          <AlertTriangle size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {d.estado === "PAGADA"
                          ? "PAGADA"
                          : estaVencida
                            ? "VENCIDA"
                            : "PENDIENTE"}
                      </span>
                    </td>

                    {/* Acción */}
                    <td className="px-5 py-4 text-right">
                      {d.estado !== "PAGADA" && (
                        <button
                          onClick={() => onPagar(d)}
                          style={{ backgroundColor: "var(--color-primary)" }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:opacity-90 active:scale-95"
                        >
                          <Banknote size={14} />
                          Cobrar
                        </button>
                      )}

                      {d.estado === "PAGADA" && (
                        <div className="flex items-center justify-end gap-1.5">
                          <BotonDescargaRecibo deudaId={d.id} />
                          <button
                            onClick={() => onRevertir(d)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 rounded-lg transition-all shadow-sm active:scale-95"
                            title="Revertir Pago"
                          >
                            <RotateCcw size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderTabla(matriculas, "Matrícula")}
      {renderTabla(pensiones, "Pensiones Mensuales")}
    </div>
  );
}
