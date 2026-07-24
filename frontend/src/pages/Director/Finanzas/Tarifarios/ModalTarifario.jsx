import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";

export default function ModalTarifario({
  onClose,
  onSuccess,
  tarifarioEditar,
}) {
  const anioActual = new Date().getFullYear();

  // Inicializamos el estado directamente con los props si existen
  const [formData, setFormData] = useState({
    gradoId: tarifarioEditar?.gradoId || "",
    montoMensual: tarifarioEditar?.montoMensual || "",
    anioEscolar: tarifarioEditar?.anioEscolar || anioActual,
    tipoTarifa: tarifarioEditar?.tipoTarifa || "PENSION",
  });

  const [grados, setGrados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGrados = async () => {
      try {
        const res = await api.get("/academicos/grados");
        setGrados(res.data);
      } catch {
        toast.error("Error al cargar los grados");
      }
    };
    fetchGrados();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tarifarioEditar) {
        await api.put(`/finanzas/tarifarios/${tarifarioEditar.id}`, formData);
        toast.success("Tarifario actualizado con éxito");
      } else {
        await api.post("/finanzas/tarifarios", formData);
        toast.success("Tarifario configurado con éxito");
      }
      onSuccess();
      onClose();
    } catch {
      toast.error("Error al guardar el tarifario");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {tarifarioEditar ? "Editar Tarifa" : "Configurar Tarifa"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Año Escolar
              </label>
              <input
                type="number"
                name="anioEscolar"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                value={formData.anioEscolar}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tipo
              </label>
              <select
                name="tipoTarifa"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                value={formData.tipoTarifa}
                onChange={handleChange}
              >
                <option value="PENSION">Pensión</option>
                <option value="MATRICULA">Matrícula</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Grado
            </label>
            <select
              name="gradoId"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
              value={formData.gradoId}
              onChange={handleChange}
            >
              <option value="">Seleccione un grado...</option>
              {grados.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Monto (S/)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="montoMensual"
              required
              placeholder="Ej: 350.00"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
              value={formData.montoMensual}
              onChange={handleChange}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "var(--color-primary)" }}
              className="px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
