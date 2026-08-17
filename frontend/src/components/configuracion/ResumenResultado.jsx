// src/components/configuracion/ResumenResultado.jsx
import { CheckCircle, AlertTriangle, FileText } from "lucide-react";

export const ResumenResultado = ({ resultado }) => {
  if (!resultado) return null;

  return (
    <div className="space-y-4 border-t pt-5 border-slate-200 dark:border-slate-700">
      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
        Resultado del Procesamiento
      </h3>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 mx-auto mb-1" />
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium block">
            Total Filas
          </span>
          <span className="text-base sm:text-xl font-bold text-slate-800 dark:text-slate-100 font-mono">
            {resultado.totalFilasProcesadas}
          </span>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
          <span className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-medium block">
            Exitosos
          </span>
          <span className="text-base sm:text-xl font-bold text-emerald-700 dark:text-emerald-300 font-mono">
            {resultado.registrosExitosos}
          </span>
        </div>
        <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-xl border border-red-200 dark:border-red-800 text-center">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 dark:text-red-400 mx-auto mb-1" />
          <span className="text-[10px] sm:text-xs text-red-500 dark:text-red-400 font-medium block">
            Fallidos
          </span>
          <span className="text-base sm:text-xl font-bold text-red-700 dark:text-red-300 font-mono">
            {resultado.registrosFallidos}
          </span>
        </div>
      </div>

      {resultado.errores?.length > 0 && (
        <div className="bg-red-50/60 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl p-3 sm:p-4 space-y-2">
          <p className="text-xs font-bold text-red-800 dark:text-red-300">
            Observaciones encontradas:
          </p>
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
            {resultado.errores.map((err, i) => (
              <p
                key={i}
                className="text-xs text-red-600 dark:text-red-400 font-mono leading-relaxed"
              >
                • {err}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
