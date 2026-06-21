import { Settings } from "lucide-react";

export default function Mantenimiento() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-4 text-center">
      <div className="animate-spin-slow mb-6">
        <Settings size={80} className="text-primary-500 text-emerald-500" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Sistema en Mantenimiento</h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
        Estamos realizando mejoras importantes en la plataforma para brindarte
        un mejor servicio. Por favor, vuelve a intentarlo en unos minutos.
      </p>
    </div>
  );
}
