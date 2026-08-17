// src/pages/Director/GestionAcademica/Cursos/KpiCardsCursos.jsx
import { BookOpen, CheckCircle, AlertTriangle } from "lucide-react";

export default function KpiCardsCursos({ cursos = [] }) {
  const activos = cursos.filter((c) => c.estado).length;
  const inactivos = cursos.length - activos;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Cursos */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
          <BookOpen size={22} />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total Cursos
          </p>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
            {cursos.length}
          </p>
        </div>
      </div>

      {/* Cursos Activos */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
          <CheckCircle size={22} />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Cursos Activos
          </p>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
            {activos}
          </p>
        </div>
      </div>

      {/* Cursos Inactivos */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
          <AlertTriangle size={22} />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Inactivos
          </p>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
            {inactivos}
          </p>
        </div>
      </div>
    </div>
  );
}
