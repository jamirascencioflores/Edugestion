import FormCambiarPassword from "./components/FormCambiarPassword";
import CardDobleFactor from "./components/CardDobleFactor";
import TablaSesionesActivas from "./components/TablaSesionesActivas";
import { ShieldCheck } from "lucide-react";

export default function SeguridadPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck style={{ color: "var(--color-primary)" }} />
          Seguridad y Acceso
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Gestiona tus credenciales, sesiones activas y la seguridad de tu
          cuenta.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FormCambiarPassword />
        <CardDobleFactor />
        <TablaSesionesActivas />
      </div>
    </div>
  );
}
