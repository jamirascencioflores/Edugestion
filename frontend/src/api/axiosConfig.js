// src/api/axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Ajusta a tu Gateway
});

// Utilidad para extraer el subdominio de la URL del navegador
const getSubdomain = () => {
  const hostname = window.location.hostname;
  // Si estás en localhost a secas, no hay subdominio
  if (hostname === "localhost" || hostname === "127.0.0.1") return null;

  const parts = hostname.split(".");
  // Si la URL es admin.localhost o sanpedro.edugestion.com, extraemos la primera parte
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
    }

    // MAGIA MULTI-TENANT: Inyectamos el subdominio de forma invisible
    const subdominio = getSubdomain();
    if (subdominio) {
      config.headers["X-Subdominio"] = subdominio;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// INTERCEPTOR DE RESPUESTA
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // ESCUDO 503: MODO MANTENIMIENTO
      if (status === 503) {
        // Redirigimos a la pantalla de mantenimiento (evitando loop infinito si ya estamos en ella)
        if (window.location.pathname !== "/mantenimiento") {
          window.location.href = "/mantenimiento";
        }
        return Promise.reject(error);
      }

      // 401 / 403: TOKEN O PERMISOS
      if (status === 401 || status === 403) {
        // Solo limpiamos y redirigimos si no estamos ya en el login
        if (window.location.pathname !== "/login") {
          console.warn("Sesión expirada o acceso denegado. Redirigiendo...");
          //localStorage.removeItem("jwt_token");
          //localStorage.removeItem("user");
          //window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
