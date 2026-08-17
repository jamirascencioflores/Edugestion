//src/pages/Director/Finanzas/Caja/BotonDescargaRecibo.jsx
import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import api from "../../../../api/axiosConfig";

const BotonDescargaRecibo = ({ deudaId }) => {
  const [cargando, setCargando] = useState(false);

  const handleDescargar = async () => {
    setCargando(true);
    try {
      const response = await api.get(`/finanzas/reportes/recibo/${deudaId}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recibo-${deudaId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al descargar el recibo PDF:", err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <button
      onClick={handleDescargar}
      disabled={cargando}
      title="Descargar Recibo PDF"
      className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-all shadow-sm disabled:opacity-50 active:scale-95"
    >
      {cargando ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Download size={16} />
      )}
    </button>
  );
};

export default BotonDescargaRecibo;
