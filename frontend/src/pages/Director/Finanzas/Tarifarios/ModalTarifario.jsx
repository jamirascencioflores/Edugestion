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

  const [formData, setFormData] = useState({
    gradoId: tarifarioEditar?.gradoId || "",
    anioEscolar:
      tarifarioEditar?.matricula?.anioEscolar ||
      tarifarioEditar?.pension?.anioEscolar ||
      anioActual,
    montoMatricula: tarifarioEditar?.matricula?.montoMensual || "",
    montoPension: tarifarioEditar?.pension?.montoMensual || "",
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
    if (!formData.gradoId) {
      toast.error("Seleccione un grado escolar");
      return;
    }

    setLoading(true);
    try {
      const peticiones = [];

      // 1. Matrícula
      if (formData.montoMatricula !== "") {
        const payloadMatricula = {
          gradoId: Number(formData.gradoId),
          anioEscolar: Number(formData.anioEscolar),
          montoMensual: Number(formData.montoMatricula),
          tipoTarifa: "MATRICULA",
        };

        if (tarifarioEditar?.matricula) {
          peticiones.push(
            api.put(
              `/finanzas/tarifarios/${tarifarioEditar.matricula.id}`,
              payloadMatricula,
            ),
          );
        } else {
          peticiones.push(api.post("/finanzas/tarifarios", payloadMatricula));
        }
      }

      // 2. Pensión
      if (formData.montoPension !== "") {
        const payloadPension = {
          gradoId: Number(formData.gradoId),
          anioEscolar: Number(formData.anioEscolar),
          montoMensual: Number(formData.montoPension),
          tipoTarifa: "PENSION",
        };

        if (tarifarioEditar?.pension) {
          peticiones.push(
            api.put(
              `/finanzas/tarifarios/${tarifarioEditar.pension.id}`,
              payloadPension,
            ),
          );
        } else {
          peticiones.push(api.post("/finanzas/tarifarios", payloadPension));
        }
      }

      await Promise.all(peticiones);
      toast.success("Tarifas guardadas correctamente");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {tarifarioEditar ? "Editar Tarifas" : "Configurar Tarifas"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Año Escolar
              </label>
              <input
                type="number"
                name="anioEscolar"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none text-sm font-semibold"
                value={formData.anioEscolar}
                onChange={handleChange}
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Grado Escolar
              </label>
              <select
                name="gradoId"
                required
                disabled={Boolean(tarifarioEditar)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/50 outline-none text-sm font-medium disabled:opacity-50"
                value={formData.gradoId}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                {grados.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Monto Matrícula (S/)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="montoMatricula"
              placeholder="Ej: 200.00"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/50 outline-none text-sm font-bold"
              value={formData.montoMatricula}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Monto Pensión Mensual (S/)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="montoPension"
              placeholder="Ej: 350.00"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/50 outline-none text-sm font-bold"
              value={formData.montoPension}
              onChange={handleChange}
            />
          </div>

          {/* Footer */}
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700 mt-6">
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
              <Save size={16} />
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
