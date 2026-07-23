import { CheckCircle, Clock, Banknote, RotateCcw } from "lucide-react";
import BotonDescargaRecibo from "./BotonDescargaRecibo"; // Ajusta la ruta relativa si es necesario

export default function TablaDeudas({ deudas, onPagar, onRevertir }) {
  // 1. Función robusta para obtener el mes
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

  // 2. Ordenamiento cronológico
  const deudasOrdenadas = [...deudas].sort(
    (a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento),
  );

  // 3. Renderizado
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <th className="p-3 text-xs font-semibold text-slate-500 uppercase">
              Concepto
            </th>
            <th className="p-3 text-xs font-semibold text-slate-500 uppercase">
              Monto
            </th>
            <th className="p-3 text-xs font-semibold text-slate-500 uppercase">
              Vencimiento
            </th>
            <th className="p-3 text-xs font-semibold text-slate-500 uppercase text-center">
              Estado
            </th>
            <th className="p-3 text-xs font-semibold text-slate-500 uppercase text-right">
              Acción
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {deudasOrdenadas.map((d) => (
            <tr
              key={d.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <td className="p-3">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Pensión {getNombreMes(d)} {d.anioEscolar}
                </p>
                {/* Muestra el número de operación si fue registrado */}
                {d.numeroOperacion && (
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Op: {d.numeroOperacion}
                  </span>
                )}
              </td>
              <td className="p-3 text-sm text-slate-700 dark:text-slate-400">
                S/ {Number(d.monto).toFixed(2)}
              </td>
              <td className="p-3 text-sm text-slate-600 dark:text-slate-500">
                {Array.isArray(d.fechaVencimiento)
                  ? `${d.fechaVencimiento[2].toString().padStart(2, "0")}/${d.fechaVencimiento[1].toString().padStart(2, "0")}/${d.fechaVencimiento[0]}`
                  : new Date(
                      d.fechaVencimiento + "T00:00:00",
                    ).toLocaleDateString()}
              </td>
              <td className="p-3 text-center">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    d.estado === "PAGADA"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  }`}
                >
                  {d.estado === "PAGADA" ? (
                    <CheckCircle size={12} />
                  ) : (
                    <Clock size={12} />
                  )}
                  {d.estado}
                </span>
              </td>
              <td className="p-3 text-right">
                {d.estado === "PENDIENTE" && (
                  <button
                    onClick={() => onPagar(d)}
                    style={{ backgroundColor: "var(--color-primary)" }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-bold rounded-lg transition-all shadow-sm hover:opacity-90 active:scale-95"
                  >
                    <Banknote size={14} />
                    Cobrar
                  </button>
                )}

                {d.estado === "PAGADA" && (
                  <div className="flex items-center justify-end gap-2">
                    {/* Botón de descarga de Recibo en PDF */}
                    <BotonDescargaRecibo deudaId={d.id} />

                    {/* Botón de Revertir Pago */}
                    <button
                      onClick={() => onRevertir(d)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold rounded-lg transition-all shadow-sm active:scale-95"
                      title="Revertir pago"
                    >
                      <RotateCcw size={14} />
                      Revertir
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
