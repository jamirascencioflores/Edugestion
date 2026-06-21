import api from "./axiosConfig";

export const calificacionApi = {
  registrar: async (calificacionData) => {
    const response = await api.post(
      "/academicos/calificaciones", 
      calificacionData,
    );
    return response.data;
  },

  listarPorCurso: async (cursoId, periodo) => {
    const response = await api.get(
      `/academicos/calificaciones/curso/${cursoId}`, 
      {
        params: { periodo },
      },
    );
    return response.data;
  },
};
