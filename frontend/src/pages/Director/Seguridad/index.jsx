// src/pages/Director/Seguridad/index.jsx
import FormCambiarPassword from "./components/FormCambiarPassword";
import CardDobleFactor from "./components/CardDobleFactor";
import TablaSesionesActivas from "./components/TablaSesionesActivas";
import { ShieldCheck } from "lucide-react";

export default function SeguridadPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck
            size={24}
            className="shrink-0"
            style={{ color: "var(--color-primary)" }}
          />
          <span>Seguridad y Acceso</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Gestiona tus credenciales, sesiones activas y la seguridad de tu
          cuenta.
        </p>
      </div>

      {/* Grid de Formularios y Tarjetas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6 items-start">
        <FormCambiarPassword />
        <CardDobleFactor />
        <TablaSesionesActivas />
      </div>
    </div>
  );
}
