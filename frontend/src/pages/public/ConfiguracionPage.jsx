// src/pages/public/ConfiguracionPage.jsx
import { CargaMasiva } from "../../components/configuracion/CargaMasiva";
import { Settings } from "lucide-react";

export const ConfiguracionPage = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Settings
            size={24}
            className="shrink-0"
            style={{ color: "var(--color-primary)" }}
          />
          <span>Configuración del Sistema</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Gestiona los parámetros generales y las herramientas de carga de datos
          de tu institución.
        </p>
      </div>

      {/* Módulo de Carga Masiva */}
      <CargaMasiva colegioId={1} />
    </div>
  );
};

export default ConfiguracionPage;
