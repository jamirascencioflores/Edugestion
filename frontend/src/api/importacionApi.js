import api from "./axiosConfig";

const ENDPOINT_ACADEMICO = "/academico/importacion";
const ENDPOINT_AUTH = "/auth/importacion";

export const importacionApi = {
  // --- MODO A: CARGA UNIFICADA ---
  importarMaestro: async (file, colegioId) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`${ENDPOINT_ACADEMICO}/maestro`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-Colegio-Id": colegioId,
      },
    });
    return response.data;
  },

  descargarPlantillaMaestro: async () => {
    const response = await api.get(`${ENDPOINT_ACADEMICO}/plantilla/maestro`, {
      responseType: "blob",
    });
    return response.data;
  },

  // --- MODO B: CARGA MODULAR POR PASOS ---
  importarEstructura: async (file, colegioId) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `${ENDPOINT_ACADEMICO}/estructura`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Colegio-Id": colegioId,
        },
      },
    );
    return response.data;
  },

  descargarPlantillaEstructura: async () => {
    const response = await api.get(
      `${ENDPOINT_ACADEMICO}/plantilla/estructura`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },

  importarDocentes: async (file, colegioId) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`${ENDPOINT_AUTH}/docentes`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-Colegio-Id": colegioId,
      },
    });
    return response.data;
  },

  descargarPlantillaDocentes: async () => {
    const response = await api.get(`${ENDPOINT_AUTH}/plantilla/docentes`, {
      responseType: "blob",
    });
    return response.data;
  },

  importarEstudiantes: async (file, colegioId) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `${ENDPOINT_ACADEMICO}/estudiantes`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Colegio-Id": colegioId, // 👈 Se cambió X-Tenant-Id por X-Colegio-Id
        },
      },
    );
    return response.data;
  },

  descargarPlantillaEstudiantes: async () => {
    const response = await api.get(
      `${ENDPOINT_ACADEMICO}/plantilla/estudiantes`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },
};
