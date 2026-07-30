// src/pages/public/ConfiguracionPage.jsx

import { CargaMasiva } from "../../components/configuracion/CargaMasiva";

export const ConfiguracionPage = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Configuración del Sistema
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Gestiona los parámetros generales y las herramientas de carga de datos
          de tu institución.
        </p>
      </div>

      {/* Módulo de Carga Masiva */}
      <CargaMasiva colegioId={1} />
    </div>
  );
};

export default ConfiguracionPage; // 👈 Agrega esta línea al final
