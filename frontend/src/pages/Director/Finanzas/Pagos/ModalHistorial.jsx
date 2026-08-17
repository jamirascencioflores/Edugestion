// src/pages/Director/Finanzas/Pagos/ModalHistorial.jsx
import { useEffect, useState } from "react";
import {
  X,
  Loader2,
  History,
  Search,
  Printer,
  Calendar,
  User,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";

const ModalHistorial = ({ isOpen, onClose, estudianteId, deudas = [] }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [descargandoPdf, setDescargandoPdf] = useState(false);
  const [filtroTexto, setFiltroTexto] = useState("");

  useEffect(() => {
    if (!isOpen || !estudianteId) return;

    const fetchHistorial = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/finanzas/historial/${estudianteId}`);
        // Validar si la respuesta es un array o viene paginada en res.data.content
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.content)
            ? res.data.content
            : [];
        setHistorial(data);
      } catch (err) {
        console.error("Error cargando historial", err);
        toast.error("No se pudo cargar el historial de pagos.");
        setHistorial([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [isOpen, estudianteId]);

  if (!isOpen) return null;

  const handleDescargarHistorialPdf = async () => {
    if (!estudianteId) return;
    setDescargandoPdf(true);
    try {
      const response = await api.get(
        `/finanzas/reportes/historial/${estudianteId}`,
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `historial_caja_${estudianteId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Historial de caja descargado en PDF.");
    } catch (error) {
      console.error("Error al descargar el historial PDF:", error);
      toast.error("No se pudo generar el historial en PDF.");
    } finally {
      setDescargandoPdf(false);
    }
  };

  // Validación defensiva para evitar el error si historial no es un array
  const listaHistorial = Array.isArray(historial) ? historial : [];
  const historialFiltrado = listaHistorial.filter((m) =>
    (m?.motivo || "").toLowerCase().includes(filtroTexto.toLowerCase()),
  );

  const resolverMonto = (mov) => {
    if (
      mov?.monto !== undefined &&
      mov?.monto !== null &&
      Number(mov.monto) > 0
    ) {
      return Number(mov.monto);
    }
    if (mov?.deudaId && Array.isArray(deudas)) {
      const deudaEncontrada = deudas.find(
        (d) => String(d.id) === String(mov.deudaId),
      );
      if (deudaEncontrada) return Number(deudaEncontrada.monto);
    }
    if (Array.isArray(deudas) && deudas.length > 0) {
      const deudaconMonto = deudas.find((d) => Number(d.monto) > 0);
      if (deudaconMonto) return Number(deudaconMonto.monto);
    }
    return 0;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col relative overflow-hidden border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Responsivo */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="w-full sm:w-auto flex justify-between items-start">
            <div>
              <h3 className="text-base sm:text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <History size={20} style={{ color: "var(--color-primary)" }} />
                Historial de Movimientos de Caja
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Consulta el registro detallado de operaciones del estudiante.
              </p>
            </div>
            <button
              onClick={onClose}
              className="sm:hidden text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
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
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <button
              onClick={onClose}
              className="hidden sm:block text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin text-purple-500" size={32} />
            </div>
          ) : (
            <>
              {/* VISTA MÓVIL (Cards) */}
              <div className="lg:hidden space-y-2.5">
                {historialFiltrado.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-400">
                    No hay movimientos registrados.
                  </div>
                ) : (
                  historialFiltrado.map((mov) => {
                    const esCobro = mov.tipoOperacion === "COBRO";
                    const montoCalculado = resolverMonto(mov);

                    return (
                      <div
                        key={mov.id}
                        className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              esCobro
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                            }`}
                          >
                            {mov.tipoOperacion}
                          </span>

                          <span
                            className={`font-mono font-bold text-xs sm:text-sm ${
                              esCobro
                                ? "text-emerald-700 dark:text-emerald-300"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {esCobro ? "+" : "-"}S/ {montoCalculado.toFixed(2)}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {mov.motivo || "Sin detalle especificado"}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {mov.fechaOperacion
                              ? new Date(mov.fechaOperacion).toLocaleString(
                                  [],
                                  {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  },
                                )
                              : "-"}
                          </span>
                          <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                            <User size={12} />
                            {mov.operador || "Director"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* VISTA DESKTOP (Tabla) */}
              <div className="hidden lg:block rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
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
                            <td className="px-4 py-3.5 font-medium text-slate-600 dark:text-slate-300 text-xs whitespace-nowrap">
                              {mov.fechaOperacion
                                ? new Date(mov.fechaOperacion).toLocaleString()
                                : "-"}
                            </td>
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
                            <td className="px-4 py-3.5 font-bold text-xs whitespace-nowrap font-mono">
                              <span
                                className={
                                  esCobro
                                    ? "text-slate-800 dark:text-slate-100"
                                    : "text-red-600 dark:text-red-400"
                                }
                              >
                                {esCobro ? "" : "-"}S/{" "}
                                {montoCalculado.toFixed(2)}
                              </span>
                            </td>
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
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
          <button
            onClick={handleDescargarHistorialPdf}
            disabled={descargandoPdf || loading || listaHistorial.length === 0}
            style={{ backgroundColor: "var(--color-primary)" }}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white rounded-xl flex items-center justify-center gap-2 hover:opacity-90 shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {descargandoPdf ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Printer size={14} />
            )}
            <span>
              {descargandoPdf ? "Generando PDF..." : "Descargar Resumen"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalHistorial;
