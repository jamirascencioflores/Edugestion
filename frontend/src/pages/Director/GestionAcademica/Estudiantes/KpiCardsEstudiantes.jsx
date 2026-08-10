import { Users, CheckCircle, AlertTriangle } from "lucide-react";


export default function KpiCardsEstudiantes({ estudiantes = [] }) {
  const matriculados = estudiantes.filter((e) => e.estado).length;
  const inactivos = estudiantes.length - matriculados;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <Users size={24} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Total Alumnos
          </p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            {estudiantes.length}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle size={24} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Matriculados
          </p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            {matriculados}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <AlertTriangle size={24} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Inactivos / Pendientes
          </p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            {inactivos}
          </p>
        </div>
      </div>
    </div>
  );
}
