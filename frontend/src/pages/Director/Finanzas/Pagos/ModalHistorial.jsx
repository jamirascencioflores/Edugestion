import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import api from "../../../../api/axiosConfig";

const ModalHistorial = ({ isOpen, onClose, estudianteId }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/50 z-50 p-4">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-3">
          Historial de Movimientos
        </h3>

        <div className="overflow-y-auto flex-1 pr-2">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="p-3 rounded-tl-lg">Fecha</th>
                  <th className="p-3">Operación</th>
                  <th className="p-3 rounded-tr-lg">Motivo / Detalle</th>
                </tr>
              </thead>
              <tbody>
                {historial.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-6 text-center text-slate-500">
                      No hay movimientos registrados.
                    </td>
                  </tr>
                ) : (
                  historial.map((mov) => (
                    <tr
                      key={mov.id}
                      className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-700 dark:text-slate-300"
                    >
                      <td className="p-3">
                        {new Date(mov.fechaOperacion).toLocaleString()}
                      </td>
                      <td className="p-3 font-semibold">
                        <span
                          className={
                            mov.tipoOperacion === "COBRO"
                              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded text-xs"
                              : "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30 px-2 py-1 rounded text-xs"
                          }
                        >
                          {mov.tipoOperacion}
                        </span>
                      </td>
                      <td className="p-3">{mov.motivo}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalHistorial;
