// src/pages/Director/Finanzas/Caja/BotonDescargaRecibo.jsx
import { useState } from "react";
import { Download, Loader2, Lock } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../../../api/axiosConfig";
import { useAuth } from "../../../../context/AuthContext";

const BotonDescargaRecibo = ({ deudaId }) => {
  const [cargando, setCargando] = useState(false);

  const { user } = useAuth();
  const permiteReportesPdf = user?.colegio?.plan?.permiteReportesPdf ?? true;

  const handleDescargar = async () => {
    if (!permiteReportesPdf) {
      const isDark = document.documentElement.classList.contains("dark");
      Swal.fire({
        title: "Recibos PDF no disponibles",
        html: `
          <div class="text-left text-sm space-y-2">
            <p>La descarga de comprobantes y recibos digitales en formato PDF forma parte de las funciones avanzadas.</p>
            <p class="text-slate-500">Actualiza tu plan a <b>Estándar o PRO</b> para emitir comprobantes a los apoderados.</p>
          </div>
        `,
        icon: "info",
        confirmButtonText: "Entendido",
        confirmButtonColor: "var(--color-primary)",
        background: isDark ? "#1e293b" : "#ffffff",
        color: isDark ? "#f1f5f9" : "#0f172a",
      });
      return;
    }

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
      title={
        permiteReportesPdf
          ? "Descargar Recibo PDF"
          : "Recibo PDF (Requiere Plan PRO)"
      }
      className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-all shadow-sm disabled:opacity-50 active:scale-95 relative"
    >
      {cargando ? (
        <Loader2 size={16} className="animate-spin" />
      ) : !permiteReportesPdf ? (
        <Lock size={16} className="text-amber-500" />
      ) : (
        <Download size={16} />
      )}
    </button>
  );
};

export default BotonDescargaRecibo;