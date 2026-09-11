// src/pages/SuperAdmin/PlanesPagos/components/EditSuscripcionModal.jsx
import { useState } from "react";
import { X, Plus, Trash2, DollarSign } from "lucide-react";

export default function EditSuscripcionModal({
  suscripcion,
  planes = [],
  onClose,
  onSubmit,
}) {
  // Inicializamos el estado directamente desde la prop "suscripcion"
  const [formData, setFormData] = useState({
    permitePortalPadres: suscripcion?.permitePortalPadres ?? false,
    permiteNotificaciones: suscripcion?.permiteNotificaciones ?? false,
    permiteReportesPdf: suscripcion?.permiteReportesPdf ?? false,
    permiteMarcaBlanca: suscripcion?.permiteMarcaBlanca ?? false,
    permiteFinanzasPro: suscripcion?.permiteFinanzasPro ?? false,
  });

  const [cargos, setCargos] = useState(
    Array.isArray(suscripcion?.cargosAdicionales)
      ? suscripcion.cargosAdicionales.map((c) => ({ ...c }))
      : [],
  );

  const modulos = [
    { key: "permitePortalPadres", label: "Portal de Padres" },
    { key: "permiteNotificaciones", label: "Notificaciones Automáticas" },
    { key: "permiteReportesPdf", label: "Reportes y PDFs Avanzados" },
    { key: "permiteMarcaBlanca", label: "Marca Blanca (Sin logos)" },
    { key: "permiteFinanzasPro", label: "Finanzas PRO (Morosidad)" },
  ];

  const handleAddCargo = () => {
    setCargos([...cargos, { concepto: "", monto: 0 }]);
  };

  const handleRemoveCargo = (index) => {
    setCargos(cargos.filter((_, i) => i !== index));
  };

  const handleCargoChange = (index, field, value) => {
    const updated = [...cargos];
    updated[index][field] = field === "monto" ? Number(value) : value;
    setCargos(updated);
  };

  // Buscar el plan fresco del estado planes
  const planActual =
    planes.find(
      (p) =>
        p.id === suscripcion?.planBaseId ||
        p.id === suscripcion?.planBase?.id ||
        p.nombre?.toUpperCase() ===
          suscripcion?.planBase?.nombre?.toUpperCase(),
    ) || suscripcion?.planBase;

  const precioBase = Number(planActual?.precioMensual || 0);
  const sumaCargos = cargos.reduce((acc, c) => acc + (Number(c.monto) || 0), 0);
  const totalCalculado = precioBase + sumaCargos;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(suscripcion.colegioId, {
      ...formData,
      cargosAdicionales: cargos,
      montoAdicional: sumaCargos,
      montoTotalMensual: totalCalculado,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h3 className="text-lg font-bold">Personalizar Suscripción</h3>
            <p className="text-xs text-slate-500">
              Colegio:{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {suscripcion?.nombreColegio || `ID: ${suscripcion?.colegioId}`}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm">
            <span className="text-slate-500">Plan Base Asignado:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {planActual?.nombre || suscripcion?.planBase?.nombre} (S/{" "}
              {precioBase.toFixed(2)}/mes)
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Módulos Activos
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {modulos.map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={formData[item.key]}
                    onChange={(e) =>
                      setFormData({ ...formData, [item.key]: e.target.checked })
                    }
                    className="rounded border-slate-300 w-4 h-4"
                    style={{ accentColor: "var(--color-primary)" }}
                  />
                  <span className="text-xs font-medium">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Cargos / Servicios Adicionales
              </p>
              <button
                type="button"
                onClick={handleAddCargo}
                className="flex items-center gap-1 text-xs font-bold transition-colors"
                style={{ color: "var(--color-primary)" }}
              >
                <Plus size={14} /> Agregar Concepto
              </button>
            </div>

            {cargos.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-900 p-3 rounded-xl text-center">
                Sin cargos adicionales asignados. Haz clic en "Agregar Concepto"
                para sumar ítems como Hosting AWS, Soporte 24/7, etc.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {cargos.map((cargo, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    <input
                      type="text"
                      placeholder="Concepto (ej. Hosting AWS Dedicado)"
                      value={cargo.concepto}
                      onChange={(e) =>
                        handleCargoChange(idx, "concepto", e.target.value)
                      }
                      className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent text-xs focus:outline-none"
                      required
                    />
                    <div className="relative w-28">
                      <DollarSign
                        size={14}
                        className="absolute left-2 top-2 text-slate-400"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={cargo.monto}
                        onChange={(e) =>
                          handleCargoChange(idx, "monto", e.target.value)
                        }
                        className="w-full pl-6 pr-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent text-xs font-bold text-right focus:outline-none"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCargo(idx)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                      title="Eliminar Cargo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-1">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Subtotal Adicionales:</span>
              <span className="font-semibold">
                + S/ {sumaCargos.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs font-bold uppercase text-slate-500">
                Mensualidad Total:
              </span>
              <span
                className="text-2xl font-extrabold"
                style={{ color: "var(--color-primary)" }}
              >
                S/ {totalCalculado.toFixed(2)}{" "}
                <span className="text-xs text-slate-400 font-normal">
                  / mes
                </span>
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-xl text-sm font-medium transition-colors shadow-md"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Guardar Suscripción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
