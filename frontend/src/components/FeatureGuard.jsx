import { Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function FeatureGuard({ feature, children }) {
  const { user } = useAuth();

  // Extraemos las banderas del objeto 'plan' que viene en el usuario autenticado
  const plan = user?.colegio?.plan || {
    permitePortalPadres: true,
    permiteNotificaciones: true,
    permiteReportesPdf: true,
    permiteFinanzasPro: true,
    permiteMarcaBlanca: false,
  };

  const isAllowed = plan[feature] ?? true;

  if (isAllowed) {
    return children;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto my-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
      <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
        <Lock size={32} />
      </div>

      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
        Módulo no disponible en tu Plan Actual
      </h2>

      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
        Esta funcionalidad requiere una suscripción con el módulo activo.
        Actualiza tu plan institucional para habilitar este acceso.
      </p>

      <div className="pt-2">
        <button
          onClick={() => alert("Contactando con ventas de EduGestión...")}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md"
        >
          Solicitar Upgrade de Plan
        </button>
      </div>
    </div>
  );
}
