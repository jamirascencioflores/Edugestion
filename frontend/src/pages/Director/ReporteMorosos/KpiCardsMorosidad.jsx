import { AlertTriangle, CreditCard, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function KpiCardsMorosidad({ totalMorosos, totalDeudaGlobal }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Alumnos Morosos
          </p>
          <p className="text-3xl font-extrabold text-rose-600 mt-1">
            {totalMorosos}
          </p>
        </div>
        <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
          <AlertTriangle size={24} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Monto Por Cobrar
          </p>
          <p className="text-3xl font-extrabold text-slate-800 mt-1">
            S/{" "}
            {totalDeudaGlobal.toLocaleString("es-PE", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
          <CreditCard size={24} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Cobranza Masiva
        </p>
        <button
          onClick={() =>
            toast.success("Iniciando envío de avisos masivos por WhatsApp...")
          }
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-sm"
        >
          <MessageCircle size={15} /> Notificar por WhatsApp
        </button>
      </div>
    </div>
  );
}
