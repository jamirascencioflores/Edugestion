// src/components/BotonDescargaBoleta.jsx
import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../api/axiosConfig";

const BotonDescargaBoleta = ({ estudianteId, periodo = "I-BIMESTRE" }) => {
  const [cargando, setCargando] = useState(false);

  const handleDescargar = async () => {
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
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-semibold transition-all shadow-xs disabled:opacity-50 active:scale-95"
      title="Descargar Boleta Oficial"
    >
      {cargando ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Download size={14} />
      )}
      <span>{cargando ? "Generando..." : "Boleta PDF"}</span>
    </button>
  );
};

export default BotonDescargaBoleta;
