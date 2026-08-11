import { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axiosConfig";

export default function ModalNuevoAnuncio({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    gradoId: "",
    seccionId: "",
    prioridad: "MEDIA",
  });

  const [grados, setGrados] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDatosAcademicos = async () => {
      try {
        const [resGrados, resSecciones] = await Promise.all([
          api.get("/academicos/grados"),
          api.get("/academicos/secciones"),
        ]);
        setGrados(resGrados.data || []);
        setSecciones(resSecciones.data || []);
      } catch {
        toast.error("Error al cargar grados y secciones");
      }
    };
    fetchDatosAcademicos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGradoChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      gradoId: value,
      seccionId: "", // reset sección
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.contenido.trim()) {
      toast.error("El título y el contenido son obligatorios");
      return;
    }

    setLoading(true);
    try {
      await api.post("/comunicaciones/anuncios", {
        titulo: formData.titulo,
        contenido: formData.contenido,
        gradoId: formData.gradoId ? Number(formData.gradoId) : null,
        seccionId: formData.seccionId ? Number(formData.seccionId) : null,
        prioridad: formData.prioridad,
      });

      toast.success("Comunicado publicado correctamente");
      onSuccess();
      onClose();
    } catch {
      toast.error("Error al publicar el comunicado");
    } finally {
      setLoading(false);
    }
  };

  const seccionesFiltradas = secciones.filter(
    (s) => String(s.gradoId || s.grado?.id) === String(formData.gradoId),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden my-8">
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Nuevo Comunicado / Anuncio
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Título del Anuncio
            </label>
            <input
              type="text"
              name="titulo"
              required
              placeholder="Ej: Reunión General de Padres de Familia"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 outline-none text-sm"
              value={formData.titulo}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Contenido / Mensaje
            </label>
            <textarea
              name="contenido"
              required
              rows={4}
              placeholder="Escribe aquí los detalles del comunicado para los apoderados y alumnos..."
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 outline-none text-sm resize-none"
              value={formData.contenido}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alcance - Grado (Opcional)
              </label>
              <select
                name="gradoId"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 outline-none text-sm"
                value={formData.gradoId}
                onChange={handleGradoChange}
              >
                <option value="">Todo el Colegio (General)</option>
                {grados.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alcance - Sección (Opcional)
              </label>
              <select
                name="seccionId"
                disabled={!formData.gradoId}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 outline-none text-sm disabled:opacity-50"
                value={formData.seccionId}
                onChange={handleChange}
              >
                <option value="">Todo el Grado</option>
                {seccionesFiltradas.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    Sección {sec.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Prioridad
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["BAJA", "MEDIA", "ALTA"].map((prio) => (
                <button
                  key={prio}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, prioridad: prio }))
                  }
                  className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                    formData.prioridad === prio
                      ? prio === "ALTA"
                        ? "bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                        : prio === "MEDIA"
                          ? "bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                          : "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {prio}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "var(--color-primary)" }}
              className="px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 shadow-sm text-sm font-semibold"
            >
              <Send size={16} />
              {loading ? "Publicando..." : "Publicar Comunicado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
