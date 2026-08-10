import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";

export default function ModalClonarMalla({
  onClose,
  onSuccess,
  seccionOrigenId,
  secciones,
  grados,
}) {
  const [seccionesDestino, setSeccionesDestino] = useState([]);
  const [incluirDocentes, setIncluirDocentes] = useState(false);
  const [loading, setLoading] = useState(false);

  const seccionOrigenObj = secciones.find((s) => s.id === seccionOrigenId);
  const gradoOrigenObj = grados.find((g) => g.id === seccionOrigenObj?.gradoId);

  // Filtrar secciones del mismo grado (excluyendo la de origen)
  const seccionesDelGrado = secciones.filter(
    (s) => s.gradoId === seccionOrigenObj?.gradoId && s.id !== seccionOrigenId,
  );

  const handleToggleSeccion = (id) => {
    setSeccionesDestino((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectTodas = () => {
    if (seccionesDestino.length === seccionesDelGrado.length) {
      setSeccionesDestino([]);
    } else {
      setSeccionesDestino(seccionesDelGrado.map((s) => s.id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (seccionesDestino.length === 0) {
      toast.warning("Seleccione al menos una sección destino");
      return;
    }

    setLoading(true);
    try {
      await api.post("/academicos/asignaciones/clonar", {
        seccionOrigenId,
        seccionesDestinoIds: seccionesDestino,
        incluirDocentes,
      });

      toast.success("Malla clonada exitosamente");
      onSuccess();
      onClose();
    } catch {
      toast.error("Error al clonar la malla curricular");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Copy size={20} style={{ color: "var(--color-primary)" }} />
            Copiar Malla
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">
              Origen:
            </span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {gradoOrigenObj?.nombre} - Sección {seccionOrigenObj?.nombre}
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Copiar hacia las secciones:
              </label>
              {seccionesDelGrado.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectTodas}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {seccionesDestino.length === seccionesDelGrado.length
                    ? "Desmarcar todas"
                    : "Seleccionar todas"}
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {seccionesDelGrado.length === 0 ? (
                <p className="text-xs text-slate-500 py-2">
                  No hay otras secciones registradas en este grado.
                </p>
              ) : (
                seccionesDelGrado.map((s) => {
                  const isChecked = seccionesDestino.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      onClick={() => handleToggleSeccion(s.id)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                        isChecked
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        Sección {s.nombre}
                      </span>
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                          isChecked
                            ? "bg-blue-600 text-white"
                            : "border border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {isChecked && <Check size={14} />}
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Opciones Adicionales */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={incluirDocentes}
                onChange={(e) => setIncluirDocentes(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600"
              />
              <span className="text-xs text-slate-600 dark:text-slate-300">
                Copiar también la asignación de docentes
              </span>
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || seccionesDestino.length === 0}
              style={{ backgroundColor: "var(--color-primary)" }}
              className="px-4 py-2 text-sm text-white font-medium rounded-lg flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 shadow-sm"
            >
              {loading ? "Clonando..." : "Clonar Malla"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
