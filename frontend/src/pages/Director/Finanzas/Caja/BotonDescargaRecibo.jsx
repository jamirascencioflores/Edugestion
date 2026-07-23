import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import api from "../../../../api/axiosConfig"; // Usa tu instancia configurada de Axios

const BotonDescargaRecibo = ({ deudaId }) => {
  const [cargando, setCargando] = useState(false);

  const handleDescargar = async () => {
    setCargando(true);
    try {
      // Hacemos la petición con responseType: 'blob' directamente
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
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-all shadow-sm disabled:opacity-50 active:scale-95"
    >
      {cargando ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <FileDown size={14} />
      )}
      Recibo
    </button>
  );
};

export default BotonDescargaRecibo;
