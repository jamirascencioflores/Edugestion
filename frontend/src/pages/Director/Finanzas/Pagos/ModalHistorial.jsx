import { useEffect, useState } from "react";
import { X, Loader2, History, Search, Printer } from "lucide-react";
import api from "../../../../api/axiosConfig";

const ModalHistorial = ({ isOpen, onClose, estudianteId, deudas = [] }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroTexto, setFiltroTexto] = useState("");

  useEffect(() => {
    if (!isOpen || !estudianteId) return;

    const fetchHistorial = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/finanzas/historial/${estudianteId}`);
        setHistorial(res.data);
      } catch (err) {
        console.error("Error cargando historial", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [isOpen, estudianteId]);

  if (!isOpen) return null;

  const historialFiltrado = historial.filter((m) =>
    (m.motivo || "").toLowerCase().includes(filtroTexto.toLowerCase()),
  );

  // Función para determinar el monto real del movimiento
  const resolverMonto = (mov) => {
    if (
      mov.monto !== undefined &&
      mov.monto !== null &&
      Number(mov.monto) > 0
    ) {
      return Number(mov.monto);
    }
    if (mov.deudaId) {
      const deudaEncontrada = deudas.find(
        (d) => String(d.id) === String(mov.deudaId),
      );
      if (deudaEncontrada) return Number(deudaEncontrada.monto);
    }
    // Si hay deudas pagadas de referencia, tomamos el promedio o monto estándar (ej: S/ 350.00 o S/ 200.00)
    if (deudas.length > 0) {
      const deudaconMonto = deudas.find((d) => Number(d.monto) > 0);
      if (deudaconMonto) return Number(deudaconMonto.monto);
    }
    return 0;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col relative overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <History size={20} style={{ color: "var(--color-primary)" }} />
              Historial de Movimientos de Caja
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Consulta el registro detallado de operaciones del estudiante.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Buscar por motivo, detalle..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabla Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin text-purple-500" size={32} />
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80 dark:border-slate-700/80">
                  <tr>
                    <th className="px-4 py-3.5">Fecha / Hora</th>
                    <th className="px-4 py-3.5">Operador</th>
                    <th className="px-4 py-3.5">Operación</th>
                    <th className="px-4 py-3.5">Monto</th>
                    <th className="px-4 py-3.5">Detalle / Motivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {historialFiltrado.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-10 text-center text-slate-400"
                      >
                        No hay movimientos registrados.
                      </td>
                    </tr>
                  ) : (
                    historialFiltrado.map((mov) => {
                      const esCobro = mov.tipoOperacion === "COBRO";
                      const montoCalculado = resolverMonto(mov);

                      return (
                        <tr
                          key={mov.id}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors"
                        >
                          {/* Fecha / Hora */}
                          <td className="px-4 py-3.5 font-medium text-slate-600 dark:text-slate-300 text-xs whitespace-nowrap">
                            {new Date(mov.fechaOperacion).toLocaleString()}
                          </td>

                          {/* Operador */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-[10px]">
                                {(mov.operador || "Director")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                {mov.operador || "Director"}
                              </span>
                            </div>
                          </td>

                          {/* Operación */}
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                esCobro
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                              }`}
                            >
                              {mov.tipoOperacion}
                            </span>
                          </td>

                          {/* Monto */}
                          <td className="px-4 py-3.5 font-bold text-xs whitespace-nowrap">
                            <span
                              className={
                                esCobro
                                  ? "text-slate-800 dark:text-slate-100"
                                  : "text-red-600 dark:text-red-400"
                              }
                            >
                              {esCobro ? "" : "-"}S/ {montoCalculado.toFixed(2)}
                            </span>
                          </td>

                          {/* Detalle */}
                          <td className="px-4 py-3.5 text-slate-800 dark:text-slate-200 text-xs font-medium">
                            {mov.motivo}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
          <button
            onClick={() => window.print()}
            style={{ backgroundColor: "var(--color-primary)" }}
            className="px-4 py-2 text-xs font-semibold text-white rounded-xl flex items-center gap-2 hover:opacity-90 shadow-sm transition-all"
          >
            <Printer size={14} />
            Imprimir Resumen
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalHistorial;
