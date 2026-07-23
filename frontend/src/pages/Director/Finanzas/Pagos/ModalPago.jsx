import { useState } from "react";
import { X } from "lucide-react";

const ModalPago = ({ isOpen, onClose, onConfirmarPago }) => {
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/50 z-50 p-4">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">
          Registrar Pago
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Método
              </label>
              <select
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
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
            <div className="w-1/2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                N° Operación
              </label>
              <input
                type="text"
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={
                  metodoPago === "Efectivo" ? "Opcional" : "Requerido"
                }
                value={numeroOperacion}
                onChange={(e) => setNumeroOperacion(e.target.value)}
                disabled={metodoPago === "Efectivo"}
                required={metodoPago !== "Efectivo"}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPago;
