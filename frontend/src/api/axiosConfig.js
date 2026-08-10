import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Ajusta a tu Gateway
});

// Utilidad para extraer el subdominio de la URL del navegador
const getSubdomain = () => {
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") return null;

  const parts = hostname.split(".");
  if (parts.length >= 2 && parts[0] !== "www") {
    return parts[0];
  }
  return null;
};

// INTERCEPTOR DE PETICIÓN
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      // Extraemos el colegioId del JWT y lo adjuntamos a los headers
      try {
        const decoded = jwtDecode(token);
        if (decoded.colegioId) {
          config.headers["X-Colegio-Id"] = decoded.colegioId;
        }
      } catch (e) {
        console.error("Error al decodificar token en interceptor:", e);
      }
    }

    const subdominio = getSubdomain();
    if (subdominio) {
      config.headers["X-Subdominio"] = subdominio;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// INTERCEPTOR DE RESPUESTA
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 503) {
        if (window.location.pathname !== "/mantenimiento") {
          window.location.href = "/mantenimiento";
        }
        return Promise.reject(error);
      }

      if (status === 401 || status === 403) {
        if (window.location.pathname !== "/login") {
          console.warn("Sesión expirada o acceso denegado. Redirigiendo...");
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
