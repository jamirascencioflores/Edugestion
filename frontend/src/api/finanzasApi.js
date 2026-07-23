import axios from "axios";

const API_BASE = "http://localhost:8080/api/finanzas"; // Ajusta la URL de tu Gateway o backend

export const finanzasApi = {
  // Petición para descargar el recibo en formato BLOB
  descargarRecibo: async (deudaId) => {
    const response = await axios.get(`${API_BASE}/reportes/recibo/${deudaId}`, {
      responseType: "blob",
    });
    return response.data;
  },
};
