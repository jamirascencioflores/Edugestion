import { CheckCircle, AlertTriangle, FileText } from "lucide-react";

export const ResumenResultado = ({ resultado }) => {
  if (!resultado) return null;

  return (
    <div className="mt-8 space-y-4 border-t pt-6 border-gray-100">
      <h3 className="font-bold text-gray-800 text-base">
        Resultado del Procesamiento
      </h3>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
          <FileText className="w-5 h-5 text-gray-500 mx-auto mb-1" />
          <span className="text-xs text-gray-400 font-medium block">
            Total Filas
          </span>
          <span className="text-xl font-bold text-gray-800">
            {resultado.totalFilasProcesadas}
          </span>
        </div>
        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-center">
          <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
          <span className="text-xs text-emerald-600 font-medium block">
            Exitosos
          </span>
          <span className="text-xl font-bold text-emerald-700">
            {resultado.registrosExitosos}
          </span>
        </div>
        <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mx-auto mb-1" />
          <span className="text-xs text-red-500 font-medium block">
            Fallidos
          </span>
          <span className="text-xl font-bold text-red-700">
            {resultado.registrosFallidos}
          </span>
        </div>
      </div>

      {resultado.errores?.length > 0 && (
        <div className="mt-4 bg-red-50/50 border border-red-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-red-800 mb-2">
            Observaciones encontradas:
          </p>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {resultado.errores.map((err, i) => (
              <p key={i} className="text-xs text-red-600 font-mono">
                • {err}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
