import { useState } from "react";
import { calificacionApi } from "./calificacionApi"; // Ajusta la ruta correcta

const BotonDescargaBoleta = ({ estudianteId, periodo }) => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleDescargar = async () => {
    setCargando(true);
    setError(null);

    try {
      const blob = await calificacionApi.descargarBoleta(estudianteId, periodo);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `boleta-${estudianteId}-${periodo}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al descargar el PDF:", err);
      setError("No se pudo descargar el documento.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ margin: "10px 0" }}>
      <button
        onClick={handleDescargar}
        disabled={cargando}
        style={{
          padding: "8px 16px",
          backgroundColor: cargando ? "#ccc" : "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: cargando ? "not-allowed" : "pointer",
        }}
      >
        {cargando ? "Generando PDF..." : "Descargar Boleta"}
      </button>

      {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
    </div>
  );
};

export default BotonDescargaBoleta;
