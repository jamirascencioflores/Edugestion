// src/pages/Director/Finanzas/Pagos/ModalPago.jsx
import { useState } from "react";
import { X, CheckCircle, CreditCard } from "lucide-react";

const ModalPago = ({ isOpen, onClose, onConfirmarPago, deuda, estudiante }) => {
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [numeroOperacion, setNumeroOperacion] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setMetodoPago("Efectivo");
    setNumeroOperacion("");
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmarPago({ metodoPago, numeroOperacion });
    setMetodoPago("Efectivo");
    setNumeroOperacion("");
  };

  const fechaHoyFormateada = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-base sm:text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <CreditCard size={20} style={{ color: "var(--color-primary)" }} />
            Registrar Pago de Pensión
          </h3>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-5"
        >
          {/* Box de Resumen Destacado */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Concepto</span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                {deuda?.concepto || "Pensión de Enseñanza"}
              </span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Estudiante</span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                {estudiante
                  ? `${estudiante.nombres} ${estudiante.apellidos}`
                  : "-"}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                Monto a Pagar
              </span>
              <span
                className="text-xl sm:text-2xl font-black font-mono"
                style={{ color: "var(--color-primary)" }}
              >
                S/ {Number(deuda?.monto || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Selector Método y N° Operación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Método de Pago
              </label>
              <select
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/50 outline-none text-xs sm:text-sm font-medium"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Yape">Yape</option>
                <option value="Plin">Plin</option>
                <option value="Transferencia">Transferencia</option>
                <option value="OtroMetodo">Otro Método</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                N° Operación / Referencia
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/50 outline-none text-xs sm:text-sm font-medium disabled:opacity-40 disabled:bg-slate-100 dark:disabled:bg-slate-900"
                placeholder={
                  metodoPago === "Efectivo"
                    ? "Opcional para efectivo"
                    : "Ej: 987654321"
                }
                value={numeroOperacion}
                onChange={(e) => setNumeroOperacion(e.target.value)}
                disabled={metodoPago === "Efectivo"}
                required={metodoPago !== "Efectivo"}
              />
            </div>
          </div>

          {/* Fecha Informativa */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Fecha de Pago
            </label>
            <input
              type="text"
              readOnly
              disabled
              value={fechaHoyFormateada}
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold cursor-not-allowed"
            />
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{ backgroundColor: "var(--color-primary)" }}
              className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 flex items-center justify-center gap-2 shadow-xs"
            >
              <CheckCircle size={16} />
              Confirmar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPago;
