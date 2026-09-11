// src/components/BotonDescargaBoleta.jsx
import { useState } from "react";
import { Download, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

const BotonDescargaBoleta = ({ estudianteId, periodo = "I-BIMESTRE" }) => {
  const [cargando, setCargando] = useState(false);
  const { user } = useAuth();

  // Flag del plan SaaS
  const permiteReportesPdf = user?.colegio?.plan?.permiteReportesPdf ?? true;

  const handleDescargar = async () => {
    if (!permiteReportesPdf) {
      const isDark = document.documentElement.classList.contains("dark");
      Swal.fire({
        title: "Función Exclusiva del Plan PRO",
        html: `
          <div class="text-left text-sm space-y-2">
            <p>La emisión y descarga de <b>Boletas de Calificaciones en PDF</b> requiere tener activo el módulo de Reportes Oficiales.</p>
            <p class="text-slate-500 dark:text-slate-400">Comunícate con administración para actualizar el plan de tu colegio.</p>
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
      const response = await api.get(
        `/academicos/calificaciones/estudiante/${estudianteId}/boleta/pdf`,
        {
          params: { periodo },
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `boleta_${estudianteId}_${periodo}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Boleta de notas descargada en PDF");
    } catch (err) {
      console.error("Error al descargar boleta:", err);
      toast.error("No se pudo generar la boleta de calificaciones.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <button
      onClick={handleDescargar}
      disabled={cargando || !estudianteId}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs disabled:opacity-50 active:scale-95 ${
        permiteReportesPdf
          ? "bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300"
          : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"
      }`}
      title={
        permiteReportesPdf
          ? "Descargar Boleta Oficial"
          : "Función Bloqueada (Plan PRO)"
      }
    >
      {cargando ? (
        <Loader2 size={14} className="animate-spin" />
      ) : !permiteReportesPdf ? (
        <Lock size={14} className="text-amber-500" />
      ) : (
        <Download size={14} />
      )}
      <span>{cargando ? "Generando..." : "Boleta PDF"}</span>
      {!permiteReportesPdf && (
        <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1 rounded font-bold">
          PRO
        </span>
      )}
    </button>
  );
};

export default BotonDescargaBoleta;
