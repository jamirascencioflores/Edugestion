import { Activity, Server, Users } from "lucide-react";

export default function DashboardSA() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Dashboard General
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Vista global de la plataforma EduGestión.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
            <Server size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">
              Estado del Servidor
            </p>
            <h3 className="text-xl font-bold text-green-500">Óptimo</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Tráfico de Red</p>
            <h3 className="text-xl font-bold">Normal</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">
              Usuarios Globales
            </p>
            <h3 className="text-xl font-bold">+15,000</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
